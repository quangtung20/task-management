import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { SignInCredentialsDto } from './dto/sign-in-credential.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
        private jwtService: JwtService,
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        return this.usersRepository.createUser(authCredentialsDto);
    }

    async signIn(
        signInCredentialsDto: SignInCredentialsDto,
    ): Promise<{ user, accessToken: string }> {
        const { username, password } = signInCredentialsDto;
        const user = await this.usersRepository.findOne({ username });

        if (!user) {
            throw new UnauthorizedException('Please check your username');
        }

        if (user && (await bcrypt.compare(password, user.password))) {

            const payload: JwtPayload = { username: username };
            const accessToken: string = await this.jwtService.sign(payload);
            delete user.password;
            delete user.tasks;
            return { user, accessToken };
        } else {
            throw new UnauthorizedException('Please check your password');
        }
    }
}

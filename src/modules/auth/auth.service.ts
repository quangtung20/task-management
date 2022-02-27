import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../config/jwt-payload.interface';
import { SignInCredentialsDto } from './dto/sign-in-credential.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthRepository)
        private authRepository: AuthRepository,
        private jwtService: JwtService,
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        try {
            const { password } = authCredentialsDto;

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = { ...authCredentialsDto, password: hashedPassword };
            await this.authRepository.save(user);
            const payload: JwtPayload = { username: user.username };
            const accessToken: string = await this.jwtService.sign(payload);
            return { accessToken };

        } catch (error) {
            if (error.code === '23505') {
                // duplicate username
                throw new ConflictException('Username or email already exists');
            } else {
                throw new InternalServerErrorException(error.message);
            }
        }

    }

    async signIn(
        signInCredentialsDto: SignInCredentialsDto,
    ): Promise<{ accessToken: string }> {
        const { username, password } = signInCredentialsDto;
        const user = await this.authRepository.findOne({ username });

        if (!user) {
            throw new UnauthorizedException('Please check your username');
        }

        if (user && (await bcrypt.compare(password, user.password))) {

            const payload: JwtPayload = { username: user.username };
            const accessToken: string = await this.jwtService.sign(payload);

            return { accessToken };
        } else {
            throw new UnauthorizedException('Please check your password');
        }
    }
}

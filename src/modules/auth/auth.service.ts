import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../config/jwt-payload.interface';
import { SignInCredentialsDto } from './dto/sign-in-credential.dto';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthRepository)
        private authRepository: AuthRepository,
        private jwtService: JwtService,
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto, res: Response): Promise<{ accesstoken: string }> {
        try {
            const { password } = authCredentialsDto;

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = { ...authCredentialsDto, password: hashedPassword };
            await this.authRepository.save(user);

            const payload: JwtPayload = { email: user.email };
            const accessToken: string = await this.jwtService.sign(payload, { expiresIn: '1d' });
            const refreshToken: string = await this.jwtService.sign(payload, { expiresIn: '7d' });

            res.cookie('refreshtoken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })
            return { accesstoken: accessToken };

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
        signInCredentialsDto: SignInCredentialsDto, res: Response
    ): Promise<{ accesstoken: string }> {
        try {
            const { email, password } = signInCredentialsDto;
            const user = await this.authRepository.findOne({ email });

            if (!user) {
                throw new UnauthorizedException('Please check your username');
            }

            if (user && (await bcrypt.compare(password, user.password))) {

                const payload: JwtPayload = { email: user.email };
                const accessToken: string = await this.jwtService.sign(payload, { expiresIn: '1d' });
                const refreshToken: string = await this.jwtService.sign(payload, { expiresIn: '7d' });

                res.cookie('refreshtoken', refreshToken, {
                    httpOnly: true,
                    path: '/auth/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
                })

                return { accesstoken: accessToken };
            } else {
                throw new UnauthorizedException('Please check your password');
            }
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async refreshToken(req: Request): Promise<{ accesstoken: string }> {
        try {
            const rfToken = req.cookies.refreshtoken;
            if (!rfToken) throw new BadRequestException("please login or Register");

            const user = this.jwtService.verify(rfToken);
            const payload: JwtPayload = { email: user.email };
            const accessToken = await this.jwtService.sign(payload, { expiresIn: '1d' });

            return { accesstoken: accessToken }
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async logout(res: Response): Promise<string> {
        try {
            res.clearCookie('refreshtoken', { path: '/auth/refresh_token' })
            return 'logged out';
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}

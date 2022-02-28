import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import Role from '../../config/role.enum';
import { User } from '../../database/entities/user.entity';
import RoleGuard from '../../guards/role.guard';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignInCredentialsDto } from './dto/sign-in-credential.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/register')
    signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        console.log(authCredentialsDto);
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/login')
    signIn(
        @Body() signInCredentialsDto: SignInCredentialsDto,
    ): Promise<{ accessToken: string }> {
        return this.authService.signIn(signInCredentialsDto);
    }
    @Get()
    @UseGuards(RoleGuard(Role.admin))
    testApi() {
        return 'hahaha';
    }

}

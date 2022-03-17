import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignInCredentialsDto } from './dto/sign-in-credential.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/register')
    signUp(
        @Body() authCredentialsDto: AuthCredentialsDto,
        @Res({ passthrough: true }) res: Response
    ): Promise<{ accesstoken: string }> {
        return this.authService.signUp(authCredentialsDto, res);
    }

    @Post('/login')
    signIn(
        @Body() signInCredentialsDto: SignInCredentialsDto,
        @Res({ passthrough: true }) res: Response
    ): Promise<{ accesstoken: string }> {
        return this.authService.signIn(signInCredentialsDto, res);
    }

    @Get('/refresh_token')
    rfToken(@Req() req: Request): Promise<{ accesstoken: string }> {
        return this.authService.refreshToken(req);
    }

    @Get('/logout')
    logout(@Res({ passthrough: true }) res: Response): Promise<string> {
        return this.authService.logout(res);
    }

}

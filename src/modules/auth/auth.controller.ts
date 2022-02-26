import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignInCredentialsDto } from './dto/sign-in-credential.dto';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import Role from './role.enum';
import RoleGuard from './role.guard';
import { User } from '../../database/entities/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/signup')
    signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<string> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    signIn(
        @Body() signInCredentialsDto: SignInCredentialsDto,
    ): Promise<{ user: User, accessToken: string }> {
        return this.authService.signIn(signInCredentialsDto);
    }
    @Get()
    @UseGuards(RoleGuard(Role.admin))
    testApi() {
        return 'hahaha';
    }
}

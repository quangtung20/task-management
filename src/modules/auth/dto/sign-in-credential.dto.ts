import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SignInCredentialsDto {

    username: string;

    password: string;
}
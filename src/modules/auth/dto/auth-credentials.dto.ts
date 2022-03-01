import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import Role from '../../../config/role.enum';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string;

  @IsEmail()
  @MinLength(4)
  @MaxLength(40)
  email: string;

  role?: Role;
}

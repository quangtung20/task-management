import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import Role from '../../../config/role.enum';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;

  @IsEmail()
  @MinLength(4)
  @MaxLength(40)
  email: string;

  role?: Role;
}

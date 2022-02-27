import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from '../../database/entities/user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  // async createUser(authCredentialsDto: AuthCredentialsDto): Promise<string> {

  // }
}

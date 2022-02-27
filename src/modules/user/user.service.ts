import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) { }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOne(id);
      const { password, ...others } = user;
      return others;
    } catch (error) {
      throw new InternalServerErrorException('user not found');
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    try {
      await this.userRepository.delete(id);
      return 'User has been deleted ...';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    };
  }
}

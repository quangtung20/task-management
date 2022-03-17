import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/database/entities/cart.entity';
import { User } from 'src/database/entities/user.entity';
import { CartRepository } from '../cart/cart.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(CartRepository)
    private cartRepository: CartRepository,
  ) { }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(_id: string) {
    try {
      const user = await this.userRepository.findOne(_id,
        { relations: ['cart', 'cart.product', 'cart.product.images'] });
      const { password, ...others } = user;
      return others;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    try {
      await this.userRepository.delete(id);
      return 'User has been deleted ...';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    };
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto,) {
    try {
      const user = await this.userRepository.findOne(id);

      const { newPassword, oldPassword, confirmPassword } = changePasswordDto;
      if (newPassword !== confirmPassword) {
        throw new BadRequestException('New password does not match')
      }
      const checkOldPass = await bcrypt.compare(oldPassword, user.password);
      if (!checkOldPass) {
        throw new BadRequestException('Old password does not match')
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await this.userRepository.update(user._id, { password: hashedPassword })
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async addCart(user: User, cart: any): Promise<string> {
    try {
      const check = await this.userRepository.findOne(user._id);
      if (!check) {
        throw new BadRequestException('User does not exist.');
      }

      await this.cartRepository.createQueryBuilder().delete().from(Cart).where('cart.user_id=:user', { user: user._id }).execute();

      for (let i: number = 0; i < cart.cart.length; i++) {
        const newCart = {
          user: user,
          product_id: cart.cart[i].product_id.toString(),
          quantity: Number(cart.cart[i].quantity),
        }

        await this.cartRepository.save(newCart);
      }

      return 'done';
    } catch (error) {
      console.log(error.message)
      throw new InternalServerErrorException(error.message);
    }
  }
}

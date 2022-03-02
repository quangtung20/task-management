import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/database/entities/cart.entity';
import { User } from 'src/database/entities/user.entity';
import { CartRepository } from '../cart/cart.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
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
        { relations: ['cart', 'cart.product', 'cart.product.image'] });
      console.log(user)
      const { password, ...others } = user;
      return others;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
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

  async addCart(user: User, cart: any): Promise<string> {
    try {
      const check = await this.userRepository.findOne(user._id);
      if (!check) {
        throw new BadRequestException('User does not exist.');
      }

      await this.cartRepository.createQueryBuilder().delete().from(Cart).execute();

      for (let i: number = 0; i < cart.cart.length; i++) {
        const newCart = {
          _id: (i + 1).toString(),
          user: user,
          product: cart.cart[i]._id.toString(),
          quantity: Number(cart.cart[i].quantity),
        }
        console.log(newCart);

        await this.cartRepository.save(newCart)
      }

      return 'done';
    } catch (error) {
      console.log(error.message)
      throw new InternalServerErrorException(error.message);
    }
  }
}

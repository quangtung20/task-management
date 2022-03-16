import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/database/entities/payment.entity';
import { Product } from 'src/database/entities/product.entity';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { ProductRepository } from '../product/product.repository';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentRepository } from './payment.repository';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: PaymentRepository,
    @InjectRepository(ProductRepository) private readonly productRepository: ProductRepository
  ) { }

  async create(createPaymentDto: any, user: User) {
    try {
      const { cart, paymentID, address } = createPaymentDto;
      const { _id, name, email } = user;
      const city = address.city;
      const newPayment = await this.paymentRepository.create({
        name, email, paymentID, user: user, cart: cart, address: city
      })

      cart.filter(item => {
        console.log(item)
        return this.sold(item._id, item.quantity, item.sold)
      })

      await this.paymentRepository.save(newPayment);
      return 'This action adds a new payment';
    } catch (error) {
      console.log(error.message)
    }
  }

  async findAll() {
    try {
      const payments = await this.paymentRepository.find();
      return payments;
    } catch (error) {
      console.log(error.message)
    }
  }

  async history(_id: string, user: User) {
    try {
      const history = await this.paymentRepository.find({ where: { user: user }, relations: ['cart'] })
      console.log(history);
      return history;
    } catch (error) {
      console.log(error.message)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }

  sold = async (_id, quantity, oldSold) => {
    await this.productRepository.update(_id, {
      sold: quantity + oldSold
    })
  }
}

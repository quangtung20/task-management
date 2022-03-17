import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentRepository } from './payment.repository';
import { AuthModule } from '../auth/auth.module';
import { Payment } from 'src/database/entities/payment.entity';
import { ProductRepository } from '../product/product.repository';
import { PaymentItem } from 'src/database/entities/payment-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, ProductRepository, PaymentItem]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule { }

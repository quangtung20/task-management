import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { UploadModule } from './upload/upload.module';
import { CartModule } from './cart/cart.module';
import { PaymentModule } from './payment/payment.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env']
    }),
    TasksModule,
    TypeOrmModule.forRoot(),
    AuthModule,
    UserModule,
    ProductModule,
    CategoryModule,
    UploadModule,
    CartModule,
    PaymentModule,
  ],
})
export class AppModule { }

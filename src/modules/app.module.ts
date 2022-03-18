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
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('STAGE') === 'prod';

        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          url: configService.get('DB_URL'),
          // host: configService.get('HOST'),
          // port: configService.get('DB_PORT'),
          // username: configService.get('DB_USERNAME'),
          // password: configService.get('DB_PASSWORD'),
          // database: configService.get('DB_NAME'),

        }
      }
    }),
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

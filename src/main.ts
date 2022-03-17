import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { AppModule } from './modules/app.module';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const corsOptions = {
    origin: [
      `${process.env.CLIENT_URL}`,
    ]
  }
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.use(morgan('dev'));
  app.useGlobalInterceptors(new TransformInterceptor());
  const port = process.env.PORT || 5000;
  await app.listen(port)
    .then(() => {
      logger.log(`Application is running on port ${port}`)
    });
}
bootstrap();

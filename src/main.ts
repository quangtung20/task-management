import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { AppModule } from './modules/app.module';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [`https://6234563453f3b4761d8c572a--netlify-9999.netlify.app`, 'http://localhost:3000'],
    credentials: true
  });
  app.use(cookieParser());
  app.use(morgan('dev'))
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  const port = process.env.PORT || 5000;
  await app.listen(port)
    .then(() => {
      logger.log(`Application is running on port ${port}`)
    });
}
bootstrap();

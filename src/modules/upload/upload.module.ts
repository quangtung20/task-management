import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from '../auth/auth.module';
import { UploadController } from './upload.controller';
import { CloudinaryProvider } from './upload.provider';
import { UploadService } from './upload.service';
@Module({
  imports: [
    AuthModule,
    MulterModule.register({
      dest: '../uploads',
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, CloudinaryProvider],
  exports: [UploadService, CloudinaryProvider],
})
export class UploadModule { }

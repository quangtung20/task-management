import { BadRequestException, Body, Controller, InternalServerErrorException, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { v2 } from 'cloudinary';
import Role from 'src/config/role.enum';
import RoleGuard from 'src/guards/role.guard';
import { DestroyFileDto } from './dto/destroy-file.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { removeTmp } from './upload.provider';
import { UploadService } from './upload.service';

@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('upload')
  @UseGuards(RoleGuard(Role.admin))
  @UseInterceptors(FilesInterceptor('image'))
  async uploadFile(@UploadedFiles() files: UploadFileDto[]) {
    try {
      if (!files) {
        throw new BadRequestException('No files were uploaded.');
      }
      if (files[0].size > 1024 * 1024 * 5) {
        removeTmp(files[0].path);
        throw new BadRequestException('Size too large.');
      }

      if (files[0].mimetype !== 'image/jpeg' && files[0].mimetype !== 'image/png') {
        removeTmp(files[0].path);
        throw new BadRequestException('File format is incorrect.');
      }
      const result = await v2.uploader.upload(files[0].path, { folder: "test" }, async (err, result) => {
        removeTmp(files[0].path);

        if (err) throw new InternalServerErrorException(err.message);

        return result;
      });

      return { public_id: result.public_id, url: result.secure_url };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('destroy')
  @UseGuards(RoleGuard(Role.admin))
  async destroyFile(@Body() destroyFileDto: DestroyFileDto) {

    if (!destroyFileDto.public_id) throw new BadRequestException('No images Selected');

    try {
      await v2.uploader.destroy(destroyFileDto.public_id);
      return 'Deleted Image'
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

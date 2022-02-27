import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 } from 'cloudinary';
import { DestroyFileDto } from './dto/destroy-file.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { removeTmp } from './upload.provider';


@Injectable()
export class UploadService {

  async uploadFile(uploadFileDto: UploadFileDto) {
    try {
      if (!uploadFileDto) {
        throw new BadRequestException('No files were uploaded.');
      }
      if (uploadFileDto.size > 1024 * 1024 * 5) {
        removeTmp(uploadFileDto.path);
        throw new BadRequestException('Size too large.');
      }

      if (uploadFileDto.mimetype !== 'image/jpeg' && uploadFileDto.mimetype !== 'image/png') {
        removeTmp(uploadFileDto.path);
        throw new BadRequestException('File format is incorrect.');
      }
      const result = await v2.uploader.upload(uploadFileDto.path, { folder: "test" }, async (err, result) => {
        removeTmp(uploadFileDto.path);

        if (err) throw new InternalServerErrorException(err.message);

        return result;
      });

      return { public_id: result.public_id, url: result.secure_url };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async destroyFile(destroyFileDto: DestroyFileDto) {

    if (!destroyFileDto.public_id) throw new BadRequestException('No images Selected');

    try {
      await v2.uploader.destroy(destroyFileDto.public_id);
      return 'Deleted Image'
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

}

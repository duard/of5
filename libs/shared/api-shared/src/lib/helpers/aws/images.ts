import { InternalServerErrorException } from '@nestjs/common';
import { Request } from 'express';
import { extname } from 'path';
import { AwsService } from '../../../services/aws/aws.service';

export async function imageValidatorAndUpload(request: Request) {
  try {
    if (request['files'].length > 0) {
      const { size, originalname, buffer } = request['files'][0];
      const sizeMb = size / 1000000;
      const mimeType = extname(originalname);

      if (sizeMb > 5 || (mimeType !== '.png' && mimeType !== '.jpg')) {
        return 'error';
      }

      const aws = new AwsService();

      const url = await aws.uploadImage(buffer, originalname);

      return url;
    }
  } catch (error) {
    throw new InternalServerErrorException();
  }
}

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { EXCEPTION } from '../enums/translate/exception.enum';

@Injectable()
export class ErrorService {
  static async next(error: any, queryRunner?: QueryRunner) {
    if (queryRunner) {
      await queryRunner.rollbackTransaction();
    }

    if (error instanceof HttpException) {
      throw error;
    }
    // if (error.hasOwnProperty('message')) {
    //   Logger.log(error.message, 'EXCEPTION SERVICE');
    // }

    if (error.prototype.hasOwnProperty.call('message')) {
      // This would compile without any issue !
      Logger.log(error.message, 'EXCEPTION SERVICE');
    }

    throw new HttpException(EXCEPTION.APP_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

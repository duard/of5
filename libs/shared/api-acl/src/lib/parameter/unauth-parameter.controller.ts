import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { ErrorService } from '../error/error.service';
import { ParameterService } from './parameter.service';

@Controller('unauth-parameters')
export class UnauthParameterController {
  constructor(public readonly service: ParameterService) {}

  @Get(':key/key')
  async findByKey(@Req() req: Request, @Param('key') key: string) {
    try {
      return await this.service.findByKey(req, key);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Get('keys')
  async findByKeys(@Req() req: Request, @Query('key') keys: string[]) {
    try {
      return await this.service.findByKeys(req, keys);
    } catch (err) {
      await ErrorService.next(err);
    }
  }
}

import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ErrorService } from '@of5/shared/api-shared';
import { Request } from 'express';

import { ParameterService } from './parameters.service';

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

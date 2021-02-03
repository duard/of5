import { Body, Controller, Get, Param, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { ACL_SCREEN, ErrorService } from '@of5/shared/api-shared';
import { Request } from 'express';

import { GlobalAcl } from '../acl/global-acl';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateParameterDTO, UpdateParameterByKeyDTO, UpdateParameterDTO } from './parameter.dto';
import { ParameterEntity } from './parameter.entity';
import { ParameterService } from './parameter.service';

@Crud({
  model: {
    type: ParameterEntity
  },
  params: {
    id: { field: 'id', primary: true, type: 'number' }
  },
  routes: {
    exclude: ['createManyBase', 'updateOneBase', 'deleteOneBase']
  }
})
@ApiTags('Parameters')
@Controller('parameters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(new GlobalAcl(ACL_SCREEN.Parameter))
export class ParameterController implements CrudController<ParameterEntity> {
  constructor(public readonly service: ParameterService) {}

  @Get(':key/key')
  async findByKey(@Req() req: Request, @Param('key') key: string) {
    try {
      return await this.service.findByKey(req, key);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Override('createOneBase')
  async create(@Req() req: Request, @Body() dto: CreateParameterDTO) {
    try {
      return await this.service.create(req, dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Override('replaceOneBase')
  async update(@Req() req: Request, @Param('id') id: number, @Body() dto: UpdateParameterDTO) {
    try {
      return await this.service.update(req, id, dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Put(':key/key')
  async updateByKey(@Req() req: Request, @Param('key') key: string, @Body() dto: UpdateParameterByKeyDTO) {
    try {
      return await this.service.updateByKey(req, key, dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }
}

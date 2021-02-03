import { Body, Controller, Get, Param, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { CreateParameterDTO, UpdateParameterByKeyDTO, UpdateParameterDTO } from 'src/dtos/parameter.dto';
import { Parameter } from 'src/entities/parameter.entity';
import { ErrorService } from '../error/error.service';
import { ParameterService } from './parameter.service';

import { Request } from 'express';
import { GlobalAcl } from 'src/acl/global-acl';
import { ACL_SCREEN } from 'src/enums/acl/screen.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Crud({
  model: {
    type: Parameter
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
export class ParameterController implements CrudController<Parameter> {
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

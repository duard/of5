import { Body, Controller, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { ErrorService } from '@of5/shared/api-shared';

import { ActionEntity, UserEntity } from '..';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserReq } from '../users/users.decorator';
import { CreateActionDTO, UpdateActionDTO } from './actions.dto';
import { ActionService } from './actions.service';

@Crud({
  model: { type: ActionEntity },
  params: {
    id: { field: 'actionId', primary: true, type: 'number' }
  },
  routes: {
    exclude: ['updateOneBase']
  },
  dto: {
    create: CreateActionDTO
  }
})
@Controller('actions')
@ApiTags('Actions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ActionController implements CrudController<ActionEntity> {
  constructor(public service: ActionService) {}

  @Override('createOneBase')
  async create(@Body() dto: CreateActionDTO) {
    try {
      return await this.service.create(dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Override('replaceOneBase')
  async update(@UserReq() user: UserEntity, @Param('id') id: number, @Body() dto: UpdateActionDTO) {
    try {
      return await this.service.update(user, id, dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }
}

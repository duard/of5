import { Body, Controller, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { UserReq } from 'src/decorators/user.decorator';
import { CreateActionDTO, UpdateActionDTO } from 'src/dtos/action.dto';
import { Action } from 'src/entities/action.entity';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ErrorService } from '../error/error.service';
import { ActionService } from './action.service';

@Crud({
  model: { type: Action },
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
export class ActionController implements CrudController<Action> {
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
  async update(@UserReq() user: User, @Param('id') id: number, @Body() dto: UpdateActionDTO) {
    try {
      return await this.service.update(user, id, dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }
}

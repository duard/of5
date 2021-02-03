import { Body, Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { ErrorService } from '@of5/shared/api-shared';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActionsOfScreenDTO, CreateScreenDTO, UpdateScreenDTO } from './screen.dto';
import { ScreenEntity } from './screen.entity';
import { ScreenService } from './screen.service';

@Crud({
  model: { type: Screen },
  params: {
    id: { field: 'screenId', primary: true, type: 'number' }
  },
  query: {
    join: {
      parent: { eager: true },
      actionsScreen: { eager: true },
      'actionsScreen.action': { eager: true }
    }
  },
  routes: {
    exclude: ['updateOneBase', 'createManyBase']
  }
})
@Controller('screens')
@ApiTags('Screens')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ScreenController implements CrudController<ScreenEntity> {
  constructor(public service: ScreenService) {}

  @Override('createOneBase')
  async create(@Body() dto: CreateScreenDTO) {
    try {
      return await this.service.create(dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Override('replaceOneBase')
  async update(@Param('id') id: number, @Body() dto: UpdateScreenDTO) {
    try {
      return await this.service.update(id, dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Get('many/actions')
  async actionsOfScreen(@Query() query: ActionsOfScreenDTO) {
    try {
      return await this.service.actionsOfScreen(query);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Get(':key/fields')
  async getFields(@Param('key') key: string) {
    try {
      return this.service.getFields(key);
    } catch (err) {
      await ErrorService.next(err);
    }
  }
}

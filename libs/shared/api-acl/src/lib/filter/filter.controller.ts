import { Body, Controller, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { ErrorService } from '@of5/shared/api-shared';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserReq } from '../users/user.decorator';
import { UserEntity } from '..';
import { CreateFilterDTO, UpdateFilterDTO } from './filter.dto';
import { FilterEntity } from './filter.entity';
import { FilterService } from './filter.service';

@Crud({
  model: { type: FilterEntity },
  params: {
    id: { field: 'filterId', primary: true, type: 'number' }
  },
  routes: {
    exclude: ['updateOneBase']
  },
  dto: {
    create: CreateFilterDTO
  }
})
@Controller('filters')
@ApiTags('Filters')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FilterController implements CrudController<FilterEntity> {
  constructor(public service: FilterService) {}

  @Override('replaceOneBase')
  async update(@UserReq() user: UserEntity, @Param('id') id: number, @Body() dto: UpdateFilterDTO) {
    try {
      return await this.service.update(user, id, dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }
}

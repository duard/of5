import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { UserReq } from 'src/decorators/user.decorator';
import { CreateFilterDTO, UpdateFilterDTO } from 'src/dtos/filter.dto';
import { Filter } from 'src/entities/filter.entity';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ErrorService } from '../error/error.service';
import { FilterService } from './filter.service';

@Crud({
  model: { type: Filter },
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
export class FilterController implements CrudController<Filter> {
  constructor(public service: FilterService) {}

  @Override('replaceOneBase')
  async update(@UserReq() user: User, @Param('id') id: number, @Body() dto: UpdateFilterDTO) {
    try {
      return await this.service.update(user, id, dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }
}

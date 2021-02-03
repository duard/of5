import { Body, Controller, Param, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { Request } from 'express';
import { GlobalAcl } from 'src/acl/global-acl';
import { MenuGroupCreateDTO, MenuGroupUpdateDTO } from 'src/dtos/menu-group.dto';
import { MenuGroup } from 'src/entities/menu-group.entity';
import { ACL_SCREEN } from 'src/enums/acl/screen.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ErrorService } from '../error/error.service';
import { MenuGroupService } from './menu-group.service';

@Crud({
  model: {
    type: MenuGroup
  },
  routes: {
    exclude: ['deleteOneBase', 'updateOneBase', 'createManyBase'],
    createOneBase: {
      returnShallow: true
    },
    updateOneBase: {
      returnShallow: true
    },
    replaceOneBase: {
      returnShallow: true
    }
  },
  params: {
    id: {
      field: 'id',
      type: 'number',
      primary: true
    }
  },
  query: {
    join: {
      createdBy: { eager: true, exclude: ['password'] },
      updatedBy: { eager: true, exclude: ['password'] }
    }
  }
})
@ApiTags('Menu Groups')
@Controller('menu-groups')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseInterceptors(new GlobalAcl(ACL_SCREEN.MenuGroup))
export class MenuGroupController implements CrudController<MenuGroup> {
  constructor(public service: MenuGroupService) {}

  @Override('createOneBase')
  async saveOne(@Req() req: Request, @Body() dto: MenuGroupCreateDTO) {
    try {
      return await this.service.saveOne(req, dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Override('replaceOneBase')
  async update(@Req() req: Request, @Param('id') id: number, @Body() dto: MenuGroupUpdateDTO) {
    try {
      return await this.service.update(req, id, dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }
}

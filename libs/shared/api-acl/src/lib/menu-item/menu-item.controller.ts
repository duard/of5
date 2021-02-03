import { Body, Controller, Param, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { SaveMenuItemDTO, UpdateMenuItemDTO } from 'src/dtos/menu-item.dto';
import { MenuItem } from '../../entities/menu-item.entity';
import { ErrorService } from '../error/error.service';
import { MenuItemService } from './menu-item.service';

import { Request } from 'express';
import { GlobalAcl } from 'src/acl/global-acl';
import { ACL_SCREEN } from 'src/enums/acl/screen.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Crud({
  model: {
    type: MenuItem
  },
  routes: {
    exclude: ['deleteOneBase', 'createManyBase', 'updateOneBase']
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
      updatedBy: { eager: true, exclude: ['password'] },
      parentMenuItem: { eager: true }
    }
  }
})
@ApiTags('Itens do Menu')
@Controller('menu-itens')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseInterceptors(new GlobalAcl(ACL_SCREEN.MenuItem))
export class MenuItemController implements CrudController<MenuItem> {
  constructor(public readonly service: MenuItemService) {}

  @Override('createOneBase')
  async saveOne(@Req() req: Request, @Body() dto: SaveMenuItemDTO) {
    try {
      return await this.service.saveOne(req, dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Override('replaceOneBase')
  async update(@Req() req: Request, @Param('id') id: number, @Body() dto: UpdateMenuItemDTO) {
    try {
      return await this.service.update(req, id, dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }
}

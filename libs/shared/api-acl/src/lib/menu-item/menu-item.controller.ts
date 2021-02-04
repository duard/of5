import { Body, Controller, Param, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { ACL_SCREEN, ErrorService } from '@of5/shared/api-shared';
import { Request } from 'express';

import { GlobalAcl } from '../acl/global-acl';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SaveMenuItemDTO, UpdateMenuItemDTO } from './menu-item.dto';
import { MenuItemEntity } from './menu-item.entity';
import { MenuItemService } from './menu-item.service';

@Crud({
  model: {
    type: MenuItemEntity
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
export class MenuItemController implements CrudController<MenuItemEntity> {
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

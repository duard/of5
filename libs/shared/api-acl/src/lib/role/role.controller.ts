import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { ErrorService } from '@of5/shared/api-shared';

import { SetFiltersDTO } from '../acl/acl.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRoleDTO, UpdateRoleDTO } from './role.dto';
import { RoleEntity } from './role.entity';
import { RoleService } from './role.service';

@Crud({
  model: { type: RoleEntity },
  params: {
    id: { field: 'roleId', primary: true, type: 'number' }
  },
  routes: {
    exclude: ['updateOneBase']
  },
  query: {
    join: {
      roleActions: { eager: true, alias: 'roleActions' },
      'roleActions.action': { eager: true },
      roleScreens: { eager: true, alias: 'roleScreens' },
      'roleScreens.screen': { eager: true }
    }
  }
})
@Controller('roles')
@ApiTags('Roles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RoleController implements CrudController<RoleEntity> {
  constructor(public service: RoleService) {}

  @Override('createOneBase')
  async create(@Body() dto: CreateRoleDTO) {
    try {
      return await this.service.create(dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Get(':id/filters')
  @ApiOkResponse({ description: 'Lista todos os filtros atribuídos a um Role' })
  async filters(@Param('id') id: number) {
    try {
      return await this.service.getFiltersThisRole(id);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Post(':id/filters')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Salva os filtros de uma tela sobrescrevendo todos os filtros anteriores setados'
  })
  async createOrReplaceFilters(@Param('id') id: number, @Body() dto: SetFiltersDTO) {
    try {
      return await this.service.createOrReplaceFilters(id, dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Delete(':roleId/filters/:filterId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Exclui um filter de um role' })
  async deleteFilter(@Param('roleId') roleId: number, @Param('filterId') filterId: number) {
    try {
      return await this.service.deleteFilter(roleId, filterId);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Delete(':roleId/filters')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Exclui todos os filtros de um role' })
  async deleteAllFilters(@Param('roleId') roleId: number) {
    try {
      return await this.service.deleteAllFilters(roleId);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Override('replaceOneBase')
  async update(@Param('id') id: number, @Body() dto: UpdateRoleDTO) {
    try {
      return await this.service.update(id, dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }
}

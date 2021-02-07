import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErrorService } from '@of5/shared/api-shared';

import { UserEntity } from '..';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserReq } from '../users/users.decorator';
import {
  AssociateActionsWithRoleDTO,
  AssociateFiltersWithRoleDTO,
  AssociateGroupWithRolesDTO,
  AssociateGroupWithUsersDTO,
  AssociateScreensWithRoleDTO,
  AssociateScreenWithActionsDTO,
  AssociateUserWithGroupsDTO,
  CanAccessDTO
} from './acl.dto';
import { AclService } from './acl.service';

@Controller('acl')
@ApiTags('ACL')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AclController {
  constructor(private service: AclService) {}

  @Get('user-menus')
  async getAcl(@UserReq() user: UserEntity) {
    try {
      return await this.service.getMenus(user);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Post('role-filters')
  async associateFiltersWithRole(@Body() dto: AssociateFiltersWithRoleDTO) {
    try {
      return await this.service.associateFiltersWithRole(dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Post('role-actions')
  async associateActionsWithRole(@Body() dto: AssociateActionsWithRoleDTO) {
    try {
      return await this.service.associateActionsWithRole(dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Post('screen-actions')
  async associateScreenWithActions(@Body() dto: AssociateScreenWithActionsDTO) {
    try {
      return await this.service.associateScreenWithActions(dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Post('role-screens')
  async associateScreensWithRole(@Body() dto: AssociateScreensWithRoleDTO) {
    try {
      return await this.service.associateScreensWithRole(dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Post('group-roles')
  async associateGroupWithRoles(@Body() dto: AssociateGroupWithRolesDTO) {
    try {
      return await this.service.associateGroupWithRoles(dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Post('user-groups')
  async userGroups(@Body() dto: AssociateUserWithGroupsDTO) {
    try {
      return await this.service.userGroups(dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Post('group-users')
  async groupUser(@Body() dto: AssociateGroupWithUsersDTO) {
    try {
      return await this.service.groupUsers(dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Get('user-actions')
  async getActions(@UserReq() user: UserEntity) {
    try {
      return await this.service.getActions(user);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Post('can-access')
  async canAccess(@UserReq() user: UserEntity, @Body() dto: CanAccessDTO) {
    try {
      return await this.service.canAccess(user, dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }
}

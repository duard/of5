import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActionEntity, UserEntity } from '../..';
import { ActionScreenEntity } from '../action-screen/action-screen.entity';
import { FilterEntity } from '../filter/filter.entity';
import { MemberEntity } from '../member/member.entity';
import { RoleActionEntity } from '../role-action/role-action.entity';
import { RoleFilterEntity } from '../role-filter/role-filter.entity';
import { RoleGroupEntity } from '../role-group/roule-group.entity';
import { RoleScreenEntity } from '../role-screen/role-screen.entity';
import { RoleEntity } from '../role/role.entity';
import { ScreenEntity } from '../screen/screen.entity';
import { UserGroupEntity } from '../user-group/user-group.entity';
import { AclController } from './acl.controller';
import { AclService } from './acl.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleEntity,
      FilterEntity,
      RoleFilterEntity,
      ActionEntity,
      RoleActionEntity,
      ScreenEntity,
      RoleScreenEntity,
      UserEntity,
      MemberEntity,
      UserGroupEntity,
      RoleGroupEntity,
      ActionScreenEntity
    ])
  ],
  controllers: [AclController],
  providers: [AclService],
  exports: [AclService, TypeOrmModule]
})
export class AclModule {}

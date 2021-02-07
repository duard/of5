import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  ActionEntity,
  ActionScreenEntity,
  FilterEntity,
  MemberEntity,
  RoleActionEntity,
  RoleEntity,
  RoleFilterEntity,
  RoleGroupEntity,
  RoleScreenEntity,
  ScreenEntity,
  UserEntity,
  UserGroupEntity
} from '..';
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

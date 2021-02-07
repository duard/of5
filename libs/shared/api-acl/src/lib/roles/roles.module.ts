import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  ActionEntity,
  RoleActionEntity,
  RoleEntity,
  RoleFilterEntity,
  RoleGroupEntity,
  RoleScreenEntity,
  ScreenEntity
} from '..';
import { RoleController } from './roles.controller';
import { RoleService } from './roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleScreenEntity,
      RoleActionEntity,
      RoleFilterEntity,
      RoleGroupEntity,

      RoleEntity,
      ScreenEntity,
      ActionEntity
    ])
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService]
})
export class RoleModule {}

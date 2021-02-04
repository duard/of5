import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActionEntity } from '../action/action.entity';
import { RoleActionEntity } from '../role-action/role-action.entity';
import { RoleFilterEntity } from '../role-filter/role-filter.entity';
import { RoleGroupEntity } from '../role-group/roule-group.entity';
import { RoleScreenEntity } from '../role-screen/role-screen.entity';
import { ScreenEntity } from '../screen/screen.entity';
import { RoleController } from './role.controller';
import { RoleEntity } from './role.entity';
import { RoleService } from './role.service';

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

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActionEntity } from '../action/action.entity';
import { RoleScreenEntity } from '../role-screen/role-screen.entity';
import { ScreenEntity } from '../screen/screen.entity';
import { RoleController } from './role.controller';
import { RoleEntity } from './role.entity';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleScreenEntity, RoleEntity, ScreenEntity, ActionEntity])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService]
})
export class RoleModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MenuGroupEntity } from '..';
import { MenuGroupController } from './menus-groups.controller';
import { MenuGroupService } from './menus-groups.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuGroupEntity])],
  providers: [MenuGroupService],
  controllers: [MenuGroupController]
})
export class MenuGroupModule {}

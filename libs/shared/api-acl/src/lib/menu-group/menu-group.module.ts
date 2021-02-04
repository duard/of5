import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MenuGroupController } from './menu-group.controller';
import { MenuGroupEntity } from './menu-group.entity';
import { MenuGroupService } from './menu-group.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuGroupEntity])],
  providers: [MenuGroupService],
  controllers: [MenuGroupController]
})
export class MenuGroupModule {}

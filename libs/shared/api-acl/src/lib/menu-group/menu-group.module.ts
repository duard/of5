import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuGroup } from 'src/entities/menu-group.entity';
import { MenuGroupController } from './menu-group.controller';
import { MenuGroupService } from './menu-group.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuGroup])],
  providers: [MenuGroupService],
  controllers: [MenuGroupController]
})
export class MenuGroupModule {}

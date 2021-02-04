import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MenuItemController } from './menu-item.controller';
import { MenuItemEntity } from './menu-item.entity';
import { MenuItemService } from './menu-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItemEntity])],
  providers: [MenuItemService],
  controllers: [MenuItemController]
})
export class MenuItemModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MenuItemEntity } from '..';
import { MenuItemController } from './menus-itens.controller';
import { MenuItemService } from './menus-itens.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItemEntity])],
  providers: [MenuItemService],
  controllers: [MenuItemController]
})
export class MenuItemModule {}

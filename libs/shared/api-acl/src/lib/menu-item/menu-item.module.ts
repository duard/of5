import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from 'src/entities/menu-item.entity';
import { MenuItemController } from './menu-item.controller';
import { MenuItemService } from './menu-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem])],
  providers: [MenuItemService],
  controllers: [MenuItemController]
})
export class MenuItemModule {}

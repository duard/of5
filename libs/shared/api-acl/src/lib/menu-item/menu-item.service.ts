import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { EXCEPTION, MENU_ITEM } from '@of5/shared/api-shared';
import { Request } from 'express';
import { getRepository, Repository } from 'typeorm';

import { getUserFromRequest } from '../functions';
import { SaveMenuItemDTO, UpdateMenuItemDTO } from './menu-item.dto';
import { MenuItemEntity } from './menu-item.entity';

@Injectable()
export class MenuItemService extends TypeOrmCrudService<MenuItemEntity> {
  constructor(
    @InjectRepository(MenuItemEntity)
    private readonly menuItemRepository: Repository<MenuItemEntity>
  ) {
    super(menuItemRepository);
  }

  async saveOne(req: Request, dto: SaveMenuItemDTO): Promise<MenuItemEntity> {
    const user = getUserFromRequest(req);

    const parentMenuItemId = dto.menuItem;
    delete dto.menuItem;

    const menuItemToSave = this.menuItemRepository.create(dto);

    if (!dto.type) {
      if (!parentMenuItemId) {
        throw new HttpException(MENU_ITEM.PARENT_REQUIRED, 400);
      }

      const parentMenuItem = await getRepository(MenuItemEntity).findOne(parentMenuItemId);

      if (!parentMenuItem) {
        throw new HttpException(MENU_ITEM.PARENT_NOT_FOUND, 400);
      }

      menuItemToSave.parentMenuItem = parentMenuItem;
    }

    menuItemToSave.createdBy = user;

    const savedMenuItem = await this.menuItemRepository.save(menuItemToSave);

    return savedMenuItem;
  }

  async update(req: Request, id: number, dto: UpdateMenuItemDTO) {
    const user = getUserFromRequest(req);

    const menuItemToEdit = await this.menuItemRepository.findOne(id);

    if (!menuItemToEdit) {
      throw new HttpException(EXCEPTION.NOT_FOUND, 400);
    }

    const parentMenuItemId = dto.menuItem;
    delete dto.menuItem;

    const menuItemToUpdate = this.menuItemRepository.create(dto);

    if (!dto.type) {
      if (!parentMenuItemId) {
        throw new HttpException(MENU_ITEM.PARENT_REQUIRED, 400);
      }

      const parentMenuItem = await getRepository(MenuItemEntity).findOne(parentMenuItemId);

      if (!parentMenuItem) {
        throw new HttpException(MENU_ITEM.PARENT_NOT_FOUND, 400);
      }

      menuItemToUpdate.parentMenuItem = parentMenuItem;
    }

    menuItemToUpdate.updatedBy = user;

    await this.menuItemRepository.update(id, menuItemToUpdate);

    const updatedMenuItem = await this.menuItemRepository.findOne(id, { relations: ['updatedBy', 'createdBy'] });

    return updatedMenuItem;
  }
}

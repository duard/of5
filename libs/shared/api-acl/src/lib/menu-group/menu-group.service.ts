import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { EXCEPTION } from '@of5/shared/api-shared';
import { Request } from 'express';
import { Repository } from 'typeorm';

import { getUserFromRequest } from '../functions';
import { MenuGroupCreateDTO, MenuGroupUpdateDTO } from './menu-group.dto';
import { MenuGroupEntity } from './menu-group.entity';

@Injectable()
export class MenuGroupService extends TypeOrmCrudService<MenuGroupEntity> {
  constructor(
    @InjectRepository(MenuGroupEntity)
    private readonly repository: Repository<MenuGroupEntity>
  ) {
    super(repository);
  }

  async saveOne(req: Request, dto: MenuGroupCreateDTO): Promise<MenuGroupEntity> {
    const menu = getUserFromRequest(req);

    const menuGroupToSave = this.repository.create(dto);
    menuGroupToSave.createdBy = menu;

    const savedGroup = await this.repository.save(menuGroupToSave);

    return savedGroup;
  }

  async update(req: Request, id: number, dto: MenuGroupUpdateDTO) {
    const menu = getUserFromRequest(req);

    const menuGroupToEdit = await this.repository.findOne(id);

    if (!menuGroupToEdit) {
      throw new HttpException(EXCEPTION.NOT_FOUND, 400);
    }

    const menuGroupToUpdate = this.repository.create(dto);
    menuGroupToUpdate.updatedBy = menu;

    await this.repository.update(id, menuGroupToUpdate);

    const updatedGroup = await this.repository.findOne(id, { relations: ['updatedBy', 'createdBy'] });

    return updatedGroup;
  }
}

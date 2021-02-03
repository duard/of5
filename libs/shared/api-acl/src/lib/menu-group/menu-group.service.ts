import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Request } from 'express';
import { MenuGroupCreateDTO, MenuGroupUpdateDTO } from 'src/dtos/menu-group.dto';
import { MenuGroup } from 'src/entities/menu-group.entity';
import { EXCEPTION } from 'src/enums/translate/exception.enum';
import { getUserFromRequest } from 'src/shared/utils/functions';
import { Repository } from 'typeorm';

@Injectable()
export class MenuGroupService extends TypeOrmCrudService<MenuGroup> {
  constructor(
    @InjectRepository(MenuGroup)
    private readonly repository: Repository<MenuGroup>
  ) {
    super(repository);
  }

  async saveOne(req: Request, dto: MenuGroupCreateDTO): Promise<MenuGroup> {
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

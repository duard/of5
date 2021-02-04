import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Equal, Repository } from 'typeorm';

import { UserEntity } from '..';
import { CreateActionDTO, UpdateActionDTO } from './action.dto';
import { ActionEntity } from './action.entity';

@Injectable()
export class ActionService extends TypeOrmCrudService<ActionEntity> {
  constructor(@InjectRepository(ActionEntity) protected repo: Repository<ActionEntity>) {
    super(repo);
  }

  async create(dto: CreateActionDTO) {
    const exists = await this.repo.find({ where: { key: Equal(dto.key) } });

    if (exists.length) {
      throw new HttpException('Action já cadastrada', HttpStatus.BAD_REQUEST);
    }

    const toSave = this.repo.create(dto);

    return await this.repo.save(toSave);
  }

  async update(user: UserEntity, id: number, dto: UpdateActionDTO) {
    const exists = await this.repo.findOne(id);

    if (!exists) {
      throw new HttpException('Action não existe', HttpStatus.NOT_FOUND);
    }

    const toUpdate = this.repo.create(dto);

    await this.repo.update(id, toUpdate);

    return await this.repo.findOne(id);
  }
}

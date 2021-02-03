import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CreateActionDTO, UpdateActionDTO } from 'src/dtos/action.dto';
import { Action } from 'src/entities/action.entity';
import { User } from 'src/entities/user.entity';
import { Equal, Repository } from 'typeorm';

@Injectable()
export class ActionService extends TypeOrmCrudService<Action> {
  constructor(@InjectRepository(Action) protected repo: Repository<Action>) {
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

  async update(user: User, id: number, dto: UpdateActionDTO) {
    const exists = await this.repo.findOne(id);

    if (!exists) {
      throw new HttpException('Action não existe', HttpStatus.NOT_FOUND);
    }

    const toUpdate = this.repo.create(dto);

    await this.repo.update(id, toUpdate);

    return await this.repo.findOne(id);
  }
}

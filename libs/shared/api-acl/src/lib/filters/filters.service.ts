import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';

import { FilterEntity, UserEntity } from '..';
import { UpdateFilterDTO } from './filters.dto';

@Injectable()
export class FilterService extends TypeOrmCrudService<FilterEntity> {
  constructor(@InjectRepository(FilterEntity) protected repo: Repository<FilterEntity>) {
    super(repo);
  }

  async update(user: UserEntity, id: number, dto: UpdateFilterDTO) {
    const exists = await this.repo.findOne(id);

    if (!exists) {
      throw new HttpException('Filter não existe', HttpStatus.NOT_FOUND);
    }

    const toUpdate = this.repo.create(dto);

    await this.repo.update(id, toUpdate);

    return await this.repo.findOne(id);
  }
}

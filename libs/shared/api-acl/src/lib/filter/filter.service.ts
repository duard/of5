import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UpdateFilterDTO } from 'src/dtos/filter.dto';
import { Filter } from 'src/entities/filter.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilterService extends TypeOrmCrudService<Filter> {
  constructor(@InjectRepository(Filter) protected repo: Repository<Filter>) {
    super(repo);
  }

  async update(user: User, id: number, dto: UpdateFilterDTO) {
    const exists = await this.repo.findOne(id);

    if (!exists) {
      throw new HttpException('Filter não existe', HttpStatus.NOT_FOUND);
    }

    const toUpdate = this.repo.create(dto);

    await this.repo.update(id, toUpdate);

    return await this.repo.findOne(id);
  }
}

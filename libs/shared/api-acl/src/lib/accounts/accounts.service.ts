import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Override } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { EXCEPTION } from '@of5/shared/api-shared';
import { Request } from 'express';
import { Repository } from 'typeorm';

import { getUserFromRequest } from '../functions';
import { CreateAccountDTO, UpdateAccountDTO } from './accounts.dto';
import { AccountEntity } from './accounts.entity';

@Injectable()
export class AccountService extends TypeOrmCrudService<AccountEntity> {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>
  ) {
    super(accountRepository);
  }

  @Override('createOneBase')
  async create(req: Request, dto: CreateAccountDTO) {
    const user = getUserFromRequest(req);

    const account = this.repo.create(dto);

    account.createdBy = user;

    return await this.repo.save(account);
  }

  @Override('replaceOneBase')
  async update(req: Request, id: number, dto: UpdateAccountDTO) {
    const user = getUserFromRequest(req);

    const isExists = await this.repo.findOne(id);

    if (!isExists) {
      throw new HttpException(EXCEPTION.NOT_FOUND, 400);
    }

    const accountToUpdate = this.repo.create(dto);
    accountToUpdate.updatedBy = user;

    await this.repo.update(id, accountToUpdate);

    return await this.repo.findOne(id, { relations: ['createdBy', 'updatedBy'] });
  }
}

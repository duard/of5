import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Override } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Request } from 'express';
import { CreateAccountDTO, UpdateAccountDTO } from 'src/dtos/account.dto';
import { EXCEPTION } from 'src/enums/translate/exception.enum';
import { getUserFromRequest } from 'src/shared/utils/functions';
import { Repository } from 'typeorm';
import { Account } from '../../entities/account.entity';

@Injectable()
export class AccountService extends TypeOrmCrudService<Account> {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>
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

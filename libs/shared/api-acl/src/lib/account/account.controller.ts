import { Body, Controller, Param, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { ACL_SCREEN, ErrorService } from '@of5/shared/api-shared';
import { Request } from 'express';

import { GlobalAcl } from '../acl/global-acl';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAccountDTO, UpdateAccountDTO } from './account.dto';
import { AccountEntity } from './account.entity';
import { AccountService } from './account.service';

@Crud({
  model: {
    type: AccountEntity
  },
  routes: {
    exclude: ['createManyBase', 'deleteOneBase', 'updateOneBase']
  },
  params: {
    id: {
      type: 'number',
      field: 'id',
      primary: true
    }
  }
})
@Controller('accounts')
@ApiTags('Account')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseInterceptors(new GlobalAcl(ACL_SCREEN.Account))
export class AccountController implements CrudController<AccountEntity> {
  constructor(public service: AccountService) {}

  @Override('createOneBase')
  async create(@Req() req: Request, @Body() dto: CreateAccountDTO) {
    try {
      return await this.service.create(req, dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Override('replaceOneBase')
  async update(@Req() req: Request, @Param('id') id: number, @Body() dto: UpdateAccountDTO) {
    try {
      return await this.service.update(req, id, dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }
}

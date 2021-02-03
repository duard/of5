import { Body, Controller, Param, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { Request } from 'express';
import { GlobalAcl } from 'src/acl/global-acl';
import { Account } from 'src/entities/account.entity';
import { ACL_SCREEN } from 'src/enums/acl/screen.enum';
import { CreateAccountDTO, UpdateAccountDTO } from '../../dtos/account.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ErrorService } from '../error/error.service';
import { AccountService } from './account.service';

@Crud({
  model: {
    type: Account
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
export class AccountController implements CrudController<Account> {
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

import { Body, Controller, Param, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

import { Crud, CrudController, Override } from '@nestjsx/crud';
import { User } from '../../entities/user.entity';
import { UsersService } from './users.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { UserReq } from 'src/decorators/user.decorator';
import { UserCreateDTO, UserUpdateDTO } from 'src/dtos/user.dto';
import { BinaryFile } from 'src/shared/interfaces/file.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ErrorService } from '../error/error.service';

@Crud({
  model: {
    type: User
  },
  routes: {
    createOneBase: {
      returnShallow: true
    },
    updateOneBase: {
      returnShallow: true
    },
    replaceOneBase: {
      returnShallow: true
    },
    exclude: ['deleteOneBase', 'updateOneBase', 'createManyBase']
  },
  params: {
    id: {
      field: 'id',
      type: 'number',
      primary: true
    }
  },
  query: {
    exclude: ['password'],
    join: {
      createdBy: { eager: true, exclude: ['password'] },
      updatedBy: { eager: true, exclude: ['password'] },
      members: { eager: true, alias: 'members' },
      'members.group': { eager: true }
    }
  }
})
@UseGuards(JwtAuthGuard)
@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService) {}

  @Override('createOneBase')
  @ApiParam({
    name: 'file',
    description: 'Foto para ser feito o upload',
    required: false,
    type: 'File'
  })
  @UseInterceptors(FileInterceptor('file'))
  async saveOne(@UserReq() user: User, @Body() dto: UserCreateDTO, @UploadedFile('file') media: BinaryFile) {
    try {
      return await this.service.saveOne(user, dto, media);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Override('replaceOneBase')
  @ApiParam({
    name: 'file',
    description: 'Foto para ser feito o upload',
    required: false,
    type: 'File'
  })
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @UserReq() user: User,
    @Param('id') id: number,
    @Body() dto: UserUpdateDTO,
    @UploadedFile('file') media: BinaryFile
  ) {
    try {
      return await this.service.update(user, id, dto, media);
    } catch (err) {
      await ErrorService.next(err);
    }
  }
}

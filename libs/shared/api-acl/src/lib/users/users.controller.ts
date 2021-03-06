import { Body, Controller, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { ErrorService } from '@of5/shared/api-shared';
import { BinaryFile, Message } from '@of5/shared/interfaces';

import { UserReq } from './users.decorator';
import { UserCreateDTO, UserUpdateDTO } from './users.dto';
import { UserEntity } from './users.entity';
import { UsersService } from './users.service';

@Crud({
  model: {
    type: UserEntity
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
// @UseGuards(JwtAuthGuard)
@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController implements CrudController<UserEntity> {
  msg: Message;
  constructor(public service: UsersService) {
    // this.msg.message = 'Testando';

    console.log('msg', this.msg);
  }

  @Override('createOneBase')
  @ApiParam({
    name: 'file',
    description: 'Foto para ser feito o upload',
    required: false,
    type: 'File'
  })
  @UseInterceptors(FileInterceptor('file'))
  async saveOne(@UserReq() user: UserEntity, @Body() dto: UserCreateDTO, @UploadedFile('file') media: BinaryFile) {
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
    @UserReq() user: UserEntity,
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

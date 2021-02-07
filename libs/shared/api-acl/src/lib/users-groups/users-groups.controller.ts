import { Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { ErrorService } from '@of5/shared/api-shared';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CloneGroupDTO, UserGroupCreateDTO, UserGroupUpdateDTO } from './users-groups.dto';
import { UserGroupEntity } from './users-groups.entity';
import { UserGroupService } from './users-groups.service';

@Crud({
  model: {
    type: UserGroupEntity
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
    join: {
      createdBy: { eager: true, exclude: ['password'] },
      updatedBy: { eager: true, exclude: ['password'] },
      members: { eager: true, alias: 'members' },
      'members.user': { eager: true, exclude: ['password'] },
      roleGroups: { eager: true, alias: 'roleGroups' },
      'roleGroups.role': { eager: true }
    }
  }
})
@ApiTags('User Groups')
@Controller('user-groups')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserGroupController implements CrudController<UserGroupEntity> {
  constructor(public readonly service: UserGroupService) {}

  @Override('createOneBase')
  async saveOne(@Req() req: Request, @Body() dto: UserGroupCreateDTO) {
    try {
      return await this.service.saveOne(req, dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Override('replaceOneBase')
  async update(@Req() req: Request, @Param('id') id: number, @Body() dto: UserGroupUpdateDTO) {
    try {
      return await this.service.update(req, id, dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }

  @Post('clone-groups')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cloneGroups(@Body() dto: CloneGroupDTO) {
    try {
      return await this.service.cloneGroups(dto);
    } catch (err) {
      await ErrorService.next(err);
    }
  }
}

/*

// export class UserGroupController implements CrudController<UserGroupEntity> {
//   constructor(public service: UserGroupService) {}

//   get base(): CrudController<UserGroupEntity> {
//     return this;
//   }

//   @Override()
//   getMany(@ParsedRequest() req: CrudRequest, @Query() query: { search: string; searchBy: string }) {
//     req.parsed.offset = req.parsed.limit * req.parsed.offset;

//     const { search, searchBy } = query;

//     if (search) {
//       req.parsed.search.$and = parseSearch(search, searchBy);
//     }

//     return this.base.getManyBase(req);
//   }
// }

*/

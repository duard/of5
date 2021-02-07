import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserGroupEntity } from '..';
import { UserGroupController } from './users-groups.controller';
import { UserGroupService } from './users-groups.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserGroupEntity])],
  providers: [UserGroupService],
  controllers: [UserGroupController]
})
export class UserGroupModule {}

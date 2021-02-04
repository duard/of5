import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroupEntity } from '..';

import { UserGroupController } from './user-group.controller';
import { UserGroupService } from './user-group.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserGroupEntity])],
  providers: [UserGroupService],
  controllers: [UserGroupController]
})
export class UserGroupModule {}

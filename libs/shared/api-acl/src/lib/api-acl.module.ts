import { Module } from '@nestjs/common';

import { UserGroupModule } from './user-group/user-group.module';

@Module({
  imports: [UserGroupModule],
  controllers: [],
  providers: [],
  exports: []
})
export class ApiAclModule {}

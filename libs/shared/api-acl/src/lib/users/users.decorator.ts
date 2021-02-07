import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getConnection } from 'typeorm';

import { UserEntity } from './users.entity';

export const UserReq = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const repo = getConnection().getRepository(UserEntity);
  const user = repo.create(req.user);
  return data ? user && user['data'] : user;
});

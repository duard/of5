import { Request } from 'express';
import { getConnection } from 'typeorm';

import { UserEntity } from './users/user.entity';

export function getUserFromRequest(req: Request): any {
  const repo = getConnection().getRepository(UserEntity);

  return repo.create(req.user);
}

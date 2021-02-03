import { Request } from 'express';
import { UserEntity } from '@of5/shared/api-acl';
import { getConnection } from 'typeorm';

export function getUserFromRequest(req: Request): any {
  const repo = getConnection().getRepository(UserEntity);

  return repo.create(req.user);
}

import { ActionEntity } from '@of5/shared/api-acl';

export interface AclData {
  canActivate: boolean;

  actions: ActionEntity[];
}

import { ActionEntity } from '..';

export interface AclData {
  canActivate: boolean;

  actions: ActionEntity[];
}

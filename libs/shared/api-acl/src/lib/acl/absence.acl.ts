import { GlobalAcl } from './global-acl';

export class AbsenceACL extends GlobalAcl {
  constructor(screen: string, exclude?: string[]) {
    super(screen, exclude);
  }
}

import { BaseMysqlEntity } from '@of5/shared/api-shared';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ActionEntity, RoleEntity } from '..';

@Entity({ name: 'roles_actions' })
export class RoleActionEntity extends BaseMysqlEntity {
  constructor(role?: RoleEntity, action?: ActionEntity) {
    super();
    this.role = role;
    this.action = action;
  }

  @ManyToOne(() => RoleEntity, (role) => role.roleActions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: RoleEntity;

  @ManyToOne(() => ActionEntity, (action) => action.roleActions)
  @JoinColumn({ name: 'action_id', referencedColumnName: 'id' })
  action: ActionEntity;
}

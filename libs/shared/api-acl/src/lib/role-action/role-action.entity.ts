import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ActionEntity, RoleEntity } from '..';

@Entity({ name: 'role_action' })
export class RoleActionEntity {
  constructor(role?: RoleEntity, action?: ActionEntity) {
    this.role = role;
    this.action = action;
  }

  @PrimaryGeneratedColumn()
  roleActionId: number;

  @ManyToOne(() => RoleEntity, (role) => role.roleActions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'roleId' })
  role: RoleEntity;

  @ManyToOne(() => ActionEntity, (action) => action.roleActions)
  @JoinColumn({ name: 'action_id', referencedColumnName: 'actionId' })
  action: ActionEntity;
}

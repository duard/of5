import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ActionEntity } from '../action/action.entity';
import { RoleEntity } from '../role/role.entity';

@Entity({ name: 'role_action' })
export class RoleActionEntity {
  constructor(role?: RoleEntity, action?: ActionEntity) {
    this.role = role;
    this.action = action;
  }

  @PrimaryGeneratedColumn()
  roleActionId: number;

  @ManyToOne((type) => RoleEntity, (role) => role.roleActions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'roleId' })
  role: RoleEntity;

  @ManyToOne((type) => ActionEntity, (action) => action.roleActions)
  @JoinColumn({ name: 'action_id', referencedColumnName: 'actionId' })
  action: ActionEntity;
}

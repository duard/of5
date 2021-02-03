import { ACTION_TYPE } from '@of5/shared/api-shared';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ActionScreenEntity } from '../action-screen/action-screen.entity';
import { RoleActionEntity } from '../role-action/role-action.entity';

@Entity({ name: 'action' })
export class ActionEntity {
  @PrimaryGeneratedColumn()
  actionId: number;

  @Column()
  name: string;

  @Column()
  key: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ type: 'enum', enum: ACTION_TYPE, nullable: true })
  type: string;

  @OneToMany((type) => RoleActionEntity, (roleAction) => roleAction.action)
  roleActions: RoleActionEntity[];

  @OneToMany((type) => ActionScreenEntity, (as) => as.action)
  actionsScreen: ActionScreenEntity[];
}

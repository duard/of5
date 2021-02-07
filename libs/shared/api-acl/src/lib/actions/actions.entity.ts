import { ACTION_TYPE, BaseMysqlEntity } from '@of5/shared/api-shared';
import { Column, Entity, OneToMany } from 'typeorm';

import { ActionScreenEntity, RoleActionEntity } from '..';

@Entity({ name: 'actions' })
export class ActionEntity extends BaseMysqlEntity {
  @Column()
  name: string;

  @Column()
  key: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ type: 'enum', enum: ACTION_TYPE, nullable: true })
  type: string;

  @OneToMany(() => RoleActionEntity, (roleAction) => roleAction.action)
  roleActions: RoleActionEntity[];

  @OneToMany(() => ActionScreenEntity, (as) => as.action)
  actionsScreen: ActionScreenEntity[];
}

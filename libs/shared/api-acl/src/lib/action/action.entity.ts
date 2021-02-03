import { ACTION_TYPE } from 'src/enums/acl/action-type.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ActionScreen } from './action-screen.entity';
import { RoleAction } from './role-action.entity';

@Entity({ name: 'action' })
export class Action {
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

  @OneToMany((type) => RoleAction, (roleAction) => roleAction.action)
  roleActions: RoleAction[];

  @OneToMany((type) => ActionScreen, (as) => as.action)
  actionsScreen: ActionScreen[];
}

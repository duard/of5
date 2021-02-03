import { SCREEN_TYPE } from '@of5/shared/api-shared';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm';

import { ActionScreenEntity } from '../action-screen/action-screen.entity';
import { FilterEntity } from '../filter/filter.entity';
import { RoleScreenEntity } from '../role-screen/role-screen.entity';

@Entity({ name: 'screen' })
@Tree('nested-set')
export class ScreenEntity {
  @PrimaryGeneratedColumn()
  screenId: number;

  @Column()
  label: string;

  @Column({ type: 'enum', enum: SCREEN_TYPE })
  type: string;

  @Column()
  key: string;

  @Column({ nullable: true })
  route: string;

  @Column({ nullable: true })
  icon: string;

  @OneToMany((type) => RoleScreenEntity, (roleScreen) => roleScreen.screen, { onDelete: 'CASCADE' })
  roleScreens: RoleScreenEntity[];

  @TreeChildren({ cascade: true })
  children: Screen[];

  @TreeParent()
  parent: Screen;

  @OneToMany((type) => ActionScreenEntity, (as) => as.screen, { onDelete: 'CASCADE' })
  actionsScreen: ActionScreenEntity[];

  @OneToMany((type) => FilterEntity, (filter) => filter.screen)
  filters: FilterEntity[];
}

import { BaseMysqlEntity, SCREEN_TYPE } from '@of5/shared/api-shared';
import { Column, Entity, JoinColumn, OneToMany, Tree, TreeChildren, TreeParent } from 'typeorm';

import { ActionScreenEntity, FilterEntity, RoleScreenEntity } from '..';

@Entity({ name: 'screens' })
@Tree('nested-set')
export class ScreenEntity extends BaseMysqlEntity {
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

  @OneToMany(() => RoleScreenEntity, (roleScreen) => roleScreen.screen, { onDelete: 'CASCADE' })
  roleScreens: RoleScreenEntity[];

  @TreeChildren({ cascade: true })
  children: ScreenEntity[];

  @TreeParent()
  @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
  parent: ScreenEntity;

  @OneToMany(() => ActionScreenEntity, (as) => as.screen, { onDelete: 'CASCADE' })
  actionsScreen: ActionScreenEntity[];

  @OneToMany(() => FilterEntity, (filter) => filter.screen)
  filters: FilterEntity[];
}

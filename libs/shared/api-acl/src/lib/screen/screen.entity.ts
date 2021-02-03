import { SCREEN_TYPE } from 'src/enums/acl/screen-type.enum';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm';
import { ActionScreen } from './action-screen.entity';
import { Filter } from './filter.entity';
import { RoleScreen } from './role-screen.entity';

@Entity({ name: 'screen' })
@Tree('nested-set')
export class Screen {
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

  @OneToMany((type) => RoleScreen, (roleScreen) => roleScreen.screen, { onDelete: 'CASCADE' })
  roleScreens: RoleScreen[];

  @TreeChildren({ cascade: true })
  children: Screen[];

  @TreeParent()
  parent: Screen;

  @OneToMany((type) => ActionScreen, (as) => as.screen, { onDelete: 'CASCADE' })
  actionsScreen: ActionScreen[];

  @OneToMany((type) => Filter, (filter) => filter.screen)
  filters: Filter[];
}

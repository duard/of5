import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleAction } from './role-action.entity';
import { RoleFilter } from './role-filter.entity';
import { RoleScreen } from './role-screen.entity';
import { RoleGroup } from './roule-group.entity';

@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn()
  roleId: number;

  @Column()
  name: string;

  @OneToMany((type) => RoleGroup, (rg) => rg.role, { onDelete: 'CASCADE' })
  roleGroups: RoleGroup[];

  @OneToMany((type) => RoleScreen, (rs) => rs.role, { onDelete: 'CASCADE' })
  roleScreens: RoleScreen[];

  @OneToMany((type) => RoleAction, (ra) => ra.role, { onDelete: 'CASCADE' })
  roleActions: RoleAction[];

  @OneToMany((type) => RoleFilter, (roleFilter) => roleFilter.role, { onDelete: 'CASCADE' })
  roleFilters: RoleFilter;
}

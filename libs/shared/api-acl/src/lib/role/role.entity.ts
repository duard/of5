import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RoleActionEntity } from '../role-action/role-action.entity';
import { RoleFilterEntity } from '../role-filter/role-filter.entity';
import { RoleGroupEntity } from '../role-group/roule-group.entity';
import { RoleScreenEntity } from '../role-screen/role-screen.entity';

@Entity({ name: 'role' })
export class RoleEntity {
  @PrimaryGeneratedColumn()
  roleId: number;

  @Column()
  name: string;

  @OneToMany((type) => RoleGroupEntity, (rg) => rg.role, { onDelete: 'CASCADE' })
  roleGroups: RoleGroupEntity[];

  @OneToMany((type) => RoleScreenEntity, (rs) => rs.role, { onDelete: 'CASCADE' })
  roleScreens: RoleScreenEntity[];

  @OneToMany((type) => RoleActionEntity, (ra) => ra.role, { onDelete: 'CASCADE' })
  roleActions: RoleActionEntity[];

  @OneToMany((type) => RoleFilterEntity, (roleFilter) => roleFilter.role, { onDelete: 'CASCADE' })
  roleFilters: RoleFilterEntity;
}

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RoleActionEntity } from '..';
import { RoleFilterEntity } from '..';
import { RoleGroupEntity } from '..';
import { RoleScreenEntity } from '..';

@Entity({ name: 'role' })
export class RoleEntity {
  @PrimaryGeneratedColumn()
  roleId: number;

  @Column()
  name: string;

  @OneToMany(() => RoleGroupEntity, (rg) => rg.role, { onDelete: 'CASCADE' })
  roleGroups: RoleGroupEntity[];

  @OneToMany(() => RoleScreenEntity, (rs) => rs.role, { onDelete: 'CASCADE' })
  roleScreens: RoleScreenEntity[];

  @OneToMany(() => RoleActionEntity, (ra) => ra.role, { onDelete: 'CASCADE' })
  roleActions: RoleActionEntity[];

  @OneToMany(() => RoleFilterEntity, (roleFilter) => roleFilter.role, { onDelete: 'CASCADE' })
  roleFilters: RoleFilterEntity;
}

import { BaseMysqlEntity } from '@of5/shared/api-shared';
import { Column, Entity, OneToMany } from 'typeorm';

import { RoleActionEntity, RoleFilterEntity, RoleGroupEntity, RoleScreenEntity } from '..';

@Entity({ name: 'roles' })
export class RoleEntity extends BaseMysqlEntity {
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

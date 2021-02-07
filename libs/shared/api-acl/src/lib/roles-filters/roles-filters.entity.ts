import { BaseMysqlEntity } from '@of5/shared/api-shared';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { FilterEntity, RoleEntity } from '..';

@Entity({ name: 'role_filters' })
export class RoleFilterEntity extends BaseMysqlEntity {
  constructor(role?: RoleEntity, filter?: FilterEntity) {
    super();
    this.filter = filter;
    this.role = role;
  }

  @ManyToOne(() => RoleEntity, (role) => role.roleFilters, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: RoleEntity;

  @ManyToOne(() => FilterEntity, (filter) => filter.roleFilters, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'filter_id', referencedColumnName: 'id' })
  filter: FilterEntity;
}

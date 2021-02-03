import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { FilterEntity } from '../filter/filter.entity';
import { RoleEntity } from '../role/role.entity';

@Entity({ name: 'role_filter' })
export class RoleFilterEntity {
  constructor(role?: RoleEntity, filter?: FilterEntity) {
    this.filter = filter;
    this.role = role;
  }

  @PrimaryGeneratedColumn()
  roleFilterId: number;

  @ManyToOne((type) => RoleEntity, (role) => role.roleFilters, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'roleId' })
  role: RoleEntity;

  @ManyToOne((type) => FilterEntity, (filter) => filter.roleFilters, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'filter_id', referencedColumnName: 'filterId' })
  filter: FilterEntity;
}

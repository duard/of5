import { BaseMysqlEntity } from '@of5/shared/api-shared';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { RoleEntity, UserGroupEntity } from '..';

@Entity({ name: 'roles_groups' })
export class RoleGroupEntity extends BaseMysqlEntity {
  constructor(group?: UserGroupEntity, role?: RoleEntity) {
    super();
    this.group = group;
    this.role = role;
  }

  @ManyToOne(() => UserGroupEntity, (g) => g.roleGroups)
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group: UserGroupEntity;

  @ManyToOne(() => RoleEntity, (r) => r.roleGroups, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: RoleEntity;
}

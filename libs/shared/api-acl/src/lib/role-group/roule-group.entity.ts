import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEntity } from '../role/role.entity';
import { UserGroupEntity } from '../user-group/user-group.entity';

@Entity({ name: 'role_group' })
export class RoleGroupEntity {
  constructor(group?: UserGroupEntity, role?: RoleEntity) {
    this.group = group;
    this.role = role;
  }

  @PrimaryGeneratedColumn()
  roleGroupId: number;

  @ManyToOne((type) => UserGroupEntity, (g) => g.roleGroups)
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group: UserGroupEntity;

  @ManyToOne((type) => RoleEntity, (r) => r.roleGroups, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'roleId' })
  role: RoleEntity;
}

import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserGroupEntity } from '..';
import { RoleEntity } from '..';

@Entity({ name: 'role_group' })
export class RoleGroupEntity {
  constructor(group?: UserGroupEntity, role?: RoleEntity) {
    this.group = group;
    this.role = role;
  }

  @PrimaryGeneratedColumn()
  roleGroupId: number;

  @ManyToOne(() => UserGroupEntity, (g) => g.roleGroups)
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group: UserGroupEntity;

  @ManyToOne(() => RoleEntity, (r) => r.roleGroups, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'roleId' })
  role: RoleEntity;
}

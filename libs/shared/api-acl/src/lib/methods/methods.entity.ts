import { BaseMysqlEntity } from '@of5/shared/api-shared';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { UserGroupEntity } from '..';

@Entity({ name: 'methods' })
export class MethodEntity extends BaseMysqlEntity {
  @Column({ name: 'description', unique: true })
  description: string;

  @ManyToMany(() => UserGroupEntity, (group) => group.methods)
  @JoinTable({
    name: 'user_group_method',
    joinColumn: {
      name: 'method_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'user_group_id',
      referencedColumnName: 'id'
    }
  })
  userGroups: UserGroupEntity[];
}

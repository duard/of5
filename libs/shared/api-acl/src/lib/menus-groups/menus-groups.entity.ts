import { BaseMysqlEntity } from '@of5/shared/api-shared';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { UserEntity } from '..';

@Entity({ name: 'menus_groups' })
export class MenuGroupEntity extends BaseMysqlEntity {
  @Column({ name: 'description', type: 'varchar', comment: 'descrição do grupo de menu' })
  description: string;

  // Usuário que criou o grupo de menu
  @ManyToOne(() => UserEntity, (user) => user.createdMenuGroup, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  createdBy: UserEntity;

  // Usuário que atualizou o grupo de menu
  @ManyToOne(() => UserEntity, (user) => user.updatedMenuGroup, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
  updatedBy: UserEntity;
}

import { BaseMysqlEntity } from '@of5/shared/api-shared';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'menu_groups' })
export class MenuGroup extends BaseMysqlEntity {
  @Column({ name: 'description', type: 'varchar', comment: 'descrição do grupo de menu' })
  description: string;

  // // Usuário que criou o grupo de menu
  // @ManyToOne((type) => User, (user) => user.createdMenuGroup, { nullable: true, onDelete: 'SET NULL' })
  // @JoinColumn({ name: created_by', referencedColumnName: 'id' })
  // createdBy: User;

  // // Usuário que atualizou o grupo de menu
  // @ManyToOne((type) => User, (user) => user.updatedMenuGroup, { nullable: true, onDelete: 'SET NULL' })
  // @JoinColumn({ name: updated_by', referencedColumnName: 'id' })
  // updatedBy: User;
}

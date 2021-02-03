import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultColumns } from './sdefcol';
import { User } from './user.entity';

@Entity({ name: 'menu_groups' })
export class MenuGroup extends DefaultColumns {
  @Column({ name: 'st_description', type: 'varchar', comment: 'descrição do grupo de menu' })
  description: string;

  // Usuário que criou o grupo de menu
  @ManyToOne((type) => User, (user) => user.createdMenuGroup, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'in_created_by', referencedColumnName: 'id' })
  createdBy: User;

  // Usuário que atualizou o grupo de menu
  @ManyToOne((type) => User, (user) => user.updatedMenuGroup, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'in_updated_by', referencedColumnName: 'id' })
  updatedBy: User;
}

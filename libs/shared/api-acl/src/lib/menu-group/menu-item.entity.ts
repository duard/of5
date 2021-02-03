import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DefaultColumns } from './sdefcol';
import { User } from './user.entity';

@Entity({ name: 'menu_itens' })
export class MenuItem extends DefaultColumns {
  @Column({ name: 'st_description', type: 'varchar', length: 250, comment: 'Descrição do menu item' })
  description: string;

  @Column({ name: 'bn_type', type: 'boolean', default: true, comment: 'Tipo do menu item true: Item, false: Sub-Item' })
  type: boolean;

  @Column({ name: 'st_route', type: 'varchar', length: 250, comment: 'Rota do menu item' })
  route: string;

  // Usuário que criou o menu item
  @ManyToOne((type) => User, (user) => user.createdMenuItens, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'in_created_by', referencedColumnName: 'id' })
  createdBy: User;

  // Usuário que atualizou o menu item
  @ManyToOne((type) => User, (user) => user.updatedMenuItens, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'in_updated_by', referencedColumnName: 'id' })
  updatedBy: User;

  // Preencher se o item de menu tiver um pai
  @ManyToOne((type) => MenuItem, (parentMenuItem) => parentMenuItem.parentMenuItens, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'in_parent_menu', referencedColumnName: 'id' })
  parentMenuItem: MenuItem;

  // Lista de menu item filhos deste menu item
  @OneToMany((type) => MenuItem, (parentMenuItem) => parentMenuItem.parentMenuItem, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  parentMenuItens: MenuItem[];
}

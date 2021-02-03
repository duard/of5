import { BaseMysqlEntity } from '@of5/shared/api-shared';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'menu_itens' })
export class MenuItem extends BaseMysqlEntity {
  @Column({ name: 'description', type: 'varchar', length: 250, comment: 'Descrição do menu item' })
  description: string;

  @Column({ name: 'type', type: 'boolean', default: true, comment: 'Tipo do menu item true: Item, false: Sub-Item' })
  type: boolean;

  @Column({ name: 'route', type: 'varchar', length: 250, comment: 'Rota do menu item' })
  route: string;

  // // Usuário que criou o menu item
  // @ManyToOne((type) => User, (user) => user.createdMenuItens, { nullable: true, onDelete: 'SET NULL' })
  // @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  // createdBy: User;

  // // Usuário que atualizou o menu item
  // @ManyToOne((type) => User, (user) => user.updatedMenuItens, { nullable: true, onDelete: 'SET NULL' })
  // @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
  // updatedBy: User;

  // // Preencher se o item de menu tiver um pai
  // @ManyToOne((type) => MenuItem, (parentMenuItem) => parentMenuItem.parentMenuItens, {
  //   nullable: true,
  //   onDelete: 'SET NULL'
  // })
  // @JoinColumn({ name: 'parent_menu', referencedColumnName: 'id' })
  // parentMenuItem: MenuItem;

  // // Lista de menu item filhos deste menu item
  // @OneToMany((type) => MenuItem, (parentMenuItem) => parentMenuItem.parentMenuItem, {
  //   nullable: true,
  //   onDelete: 'SET NULL'
  // })
  // parentMenuItens: MenuItem[];
}

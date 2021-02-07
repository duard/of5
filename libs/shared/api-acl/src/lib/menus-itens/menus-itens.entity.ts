import { BaseMysqlEntity } from '@of5/shared/api-shared';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { UserEntity } from '..';

@Entity({ name: 'menus_itens' })
export class MenuItemEntity extends BaseMysqlEntity {
  @Column({ name: 'description', type: 'varchar', length: 250, comment: 'Descrição do menu item' })
  description: string;

  @Column({ name: 'type', type: 'boolean', default: true, comment: 'Tipo do menu item true: Item, false: Sub-Item' })
  type: boolean;

  @Column({ name: 'route', type: 'varchar', length: 250, comment: 'Rota do menu item' })
  route: string;

  // Usuário que criou o menu item
  @ManyToOne(() => UserEntity, (user) => user.createdMenuItens, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  createdBy: UserEntity;

  // Usuário que atualizou o menu item
  @ManyToOne(() => UserEntity, (user) => user.updatedMenuItens, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
  updatedBy: UserEntity;

  // Preencher se o item de menu tiver um pai
  @ManyToOne(() => MenuItemEntity, (parentMenuItem) => parentMenuItem.parentMenuItens, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
  parentMenuItem: MenuItemEntity;

  // Lista de menu item filhos deste menu item
  @OneToMany(() => MenuItemEntity, (parentMenuItem) => parentMenuItem.parentMenuItem, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  parentMenuItens: MenuItemEntity[];
}

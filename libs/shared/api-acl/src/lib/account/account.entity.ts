import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultColumns } from './sdefcol';
import { User } from './user.entity';

@Entity()
export class Account extends DefaultColumns {
  @Column({ name: 'st_description', type: 'varchar', comment: 'Descrição' })
  description: string;

  @Column({ name: 'st_url', type: 'varchar', comment: 'URL da conta' })
  url: string;

  @Column({ name: 'st_token', type: 'varchar', comment: 'Token da conta' })
  token: string;

  @Column({ name: 'st_user', type: 'varchar', comment: 'Nome de usuário da conta' })
  user: string;

  @Column({ name: 'st_password', type: 'varchar', comment: 'Senha da conta' })
  password: string;

  // Usuário que criou a conta
  @ManyToOne((type) => User, (user) => user.createdAccounts, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'in_created_by', referencedColumnName: 'id' })
  createdBy: User;

  // Usuário que atualizou a conta
  @ManyToOne((type) => User, (user) => user.updatedAccounts, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'in_updated_by', referencedColumnName: 'id' })
  updatedBy: User;
}

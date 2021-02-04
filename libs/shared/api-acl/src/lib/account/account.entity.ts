import { BaseMysqlEntity } from '@of5/shared/api-shared';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '..';

@Entity()
export class AccountEntity extends BaseMysqlEntity {
  @Column({ name: 'description', type: 'varchar', comment: 'Descrição' })
  description: string;

  @Column({ name: 'url', type: 'varchar', comment: 'URL da conta' })
  url: string;

  @Column({ name: 'token', type: 'varchar', comment: 'Token da conta' })
  token: string;

  @Column({ name: 'user', type: 'varchar', comment: 'Nome de usuário da conta' })
  user: string;

  @Column({ name: 'password', type: 'varchar', comment: 'Senha da conta' })
  password: string;

  // Usuário que criou a conta
  @ManyToOne(() => UserEntity, (user) => user.createdAccounts, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  createdBy: UserEntity;

  // Usuário que atualizou a conta
  @ManyToOne(() => UserEntity, (user) => user.updatedAccounts, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
  updatedBy: UserEntity;
}

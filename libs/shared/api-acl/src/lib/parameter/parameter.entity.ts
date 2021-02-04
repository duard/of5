import { BaseMysqlEntity } from '@of5/shared/api-shared';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { UserEntity } from '..';

@Entity({ name: 'parameters' })
export class ParameterEntity extends BaseMysqlEntity {
  @Column({ name: 'DESCRIPTION', type: 'varchar', nullable: true, comment: 'Descrição' })
  description: string;

  @Column({ name: 'VALUE', type: 'varchar', nullable: true, comment: 'Valor' })
  value: string;

  @Column({ name: 'KEY', type: 'varchar', comment: 'Chave' })
  key: string;

  @Column({ name: 'OLD_VALUE', type: 'varchar', comment: 'Valor anterior', nullable: true })
  oldValue: string;

  // Usuário que criou o parametro
  @ManyToOne((type) => UserEntity, (user) => user.createdParameters, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  createdBy: UserEntity;

  // Usuário que atualizou o parametro
  @ManyToOne((type) => UserEntity, (user) => user.updatedParameters, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
  updatedBy: UserEntity;
}

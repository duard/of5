import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultColumns } from './sdefcol';
import { User } from './user.entity';

@Entity({ name: 'parameters' })
export class Parameter extends DefaultColumns {
  @Column({ name: 'ST_DESCRIPTION', type: 'varchar', nullable: true, comment: 'Descrição' })
  description: string;

  @Column({ name: 'ST_VALUE', type: 'varchar', nullable: true, comment: 'Valor' })
  value: string;

  @Column({ name: 'ST_KEY', type: 'varchar', comment: 'Chave' })
  key: string;

  @Column({ name: 'ST_OLD_VALUE', type: 'varchar', comment: 'Valor anterior', nullable: true })
  oldValue: string;

  // Usuário que criou o parametro
  @ManyToOne((type) => User, (user) => user.createdParameters, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'in_created_by', referencedColumnName: 'id' })
  createdBy: User;

  // Usuário que atualizou o parametro
  @ManyToOne((type) => User, (user) => user.updatedParameters, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'in_updated_by', referencedColumnName: 'id' })
  updatedBy: User;
}

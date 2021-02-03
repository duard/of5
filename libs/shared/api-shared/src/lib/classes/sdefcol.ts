import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class DefaultColumns {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: 'CHAVE PRIMÁRIA DA TABELA' })
  id: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at', comment: 'DATA DE CRIAÇÃO' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at', comment: 'DATA DE ATUALIZAÇÃO' })
  updatedAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'deleted_at', comment: 'DATA DE DELEÇÃO' })
  deletedAt: Date;

  @Column({ name: 'status', type: 'boolean', default: true, comment: 'STATUS DO REGISTRO ATIVO/INATIVO' })
  status: boolean;
}

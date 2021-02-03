import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { DefaultColumns, BaseMysqlEntity } from '@of5/shared/api-shared';

@Entity({ name: 'user_groups' })
export class UserGroupEntity extends BaseMysqlEntity {
  @Column({ name: 'description', type: 'varchar', comment: 'Nome do grupo de usuário' })
  description: string;

  @Column({ name: 'color_group', type: 'varchar', comment: 'Cor do grupo' })
  colorGroup: string;

  @Column({ name: 'pass_expiration', type: 'timestamp', comment: 'Data de expiração da senha' })
  passExpiration: Date;

  // @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // updatedAt: Date;

  @Column({ name: 'pass_change', type: 'boolean', comment: 'Trocar senha? Sim/Não' })
  passChange: boolean;

  @Column({ name: 'pass_day_change', type: 'int', comment: 'Dias para troca de senha' })
  passDaysChange: number;

  @Column({ name: 'timeout', type: 'int', comment: 'Tempo de expiração' })
  timeout: number;

  @Column({ name: 'mdi', type: 'boolean', comment: 'Utiliza mdi? Sim/Não' })
  mdi: boolean;

  @Column({ name: 'mid_max', type: 'int', comment: 'Numero máximo de janelas MDI' })
  mdiMax: number;

  //   // Usuário que criou o grupo
  //   @ManyToOne((type) => User, (user) => user.createdGroups, { nullable: true, onDelete: 'SET NULL' })
  //   @JoinColumn({ name: created_by', referencedColumnName: 'id' })
  //   createdBy: User;

  //   // Usuário que atualizou o grupo
  //   @ManyToOne((type) => User, (user) => user.updatedGroups, { nullable: true, onDelete: 'SET NULL' })
  //   @JoinColumn({ name: updated_by', referencedColumnName: 'id' })
  //   updatedBy: User;

  //   @ManyToMany(() => Method, (method) => method.userGroups)
  //   methods: Method[];

  //   // ACL
  //   @OneToMany((type) => Member, (member) => member.group)
  //   members: Member[];

  //   @OneToMany((type) => RoleGroup, (rg) => rg.group)
  //   roleGroups: RoleGroup[];
}

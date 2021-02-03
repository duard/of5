import { BaseMysqlEntity } from '@of5/shared/api-shared';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

import { MemberEntity } from '../member/member.entity';
import { MethodEntity } from '../method/method.entity';
import { RoleGroupEntity } from '../role-group/roule-group.entity';
import { UserEntity } from '../users/user.entity';

@Entity({ name: 'user_groups' })
export class UserGroupEntity extends BaseMysqlEntity {
  @Column({ name: 'description', type: 'varchar', comment: 'Nome do grupo de usuário' })
  description: string;

  @Column({ name: 'color_group', type: 'varchar', comment: 'Cor do grupo' })
  colorGroup: string;

  @Column({ name: 'pass_expiration', type: 'timestamp', comment: 'Data de expiração da senha' })
  passExpiration: Date;

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

  // Usuário que criou o grupo
  @ManyToOne(() => UserEntity, (user) => user.createdGroups, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  createdBy: UserEntity;

  // Usuário que atualizou o grupo
  @ManyToOne(() => UserEntity, (user) => user.updatedGroups, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
  updatedBy: UserEntity;

  @ManyToMany(() => MethodEntity, (method) => method.userGroups)
  methods: MethodEntity[];

  // ACL
  @OneToMany(() => MemberEntity, (member) => member.group)
  members: MemberEntity[];

  @OneToMany((type) => RoleGroupEntity, (rg) => rg.group)
  roleGroups: RoleGroupEntity[];
}
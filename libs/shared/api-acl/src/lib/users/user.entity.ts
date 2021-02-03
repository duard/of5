import { BaseMysqlEntity } from '@of5/shared/api-shared';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Member } from '../member/member.entity';
import { UserGroupEntity } from '../user-group/user-group.entity';
// import { Account } from './account.entity';
// import { Member } from './member.entity';
// import { MenuGroup } from './menu-group.entity';
// import { MenuItem } from './menu-item.entity';
// import { Parameter } from './parameter.entity';
//
// import { UserGroup } from './user-group.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseMysqlEntity {
  @Column({ type: 'varchar', length: 20, name: 'username', comment: 'NOME' })
  username: string;

  @Column({ type: 'varchar', length: 50, name: 'email', comment: 'EMAIL' })
  email: string;

  @Column({ type: 'varchar', length: 100, name: 'password', select: false, comment: 'SENHA' })
  password: string;

  @Column({ type: 'varchar', length: 250, name: 'facebook', comment: 'FACEBOOK' })
  facebook: string;

  @Column({ type: 'varchar', length: 250, name: 'instagram', comment: 'INSTAGRAM' })
  instagram: string;

  @Column({ type: 'varchar', length: 250, name: 'linkedin', comment: 'LINKEDIN' })
  linkedin: string;

  @Column({ type: 'varchar', length: 250, name: 'skype', comment: 'SKYPE' })
  skype: string;

  @Column({ type: 'varchar', name: 'url_photo', comment: 'URL FOTO', nullable: true })
  urlPhoto: string;

  @Column({ type: 'varchar', name: 'uuid_s3', comment: 'Identificação da foto na s3', nullable: true })
  uuid: string;

  @Column({ type: 'varchar', length: 25, name: 'phone', comment: 'TELEFONE' })
  phone: string;

  @Column({ type: 'date', name: 'bithday', comment: 'DATA DE NASCIMENTO' })
  birthday: Date;

  @Column({ type: 'timestamp', name: 'pass_expiration', nullable: true, comment: 'DATA DE EXPIRAÇÃO DA SENHA' })
  passExpiration: Date;

  @Column({ type: 'boolean', name: 'pass_change', default: false, comment: 'TROCAR SENHA SIM/NÃO' })
  passChange: boolean;

  @Column({
    type: 'int',
    name: 'pass_days_change',
    nullable: true,
    comment: 'TROCAR SENHA PERIÓDICAMENTE A CADA N DIAS'
  })
  passDaysChange: number;

  @Column({ type: 'int', name: 'timeout', comment: 'TIMEOUT EM MINUTOS' })
  timeout: number;

  @Column({ type: 'boolean', name: 'mdi', comment: 'UTILIZA MDI SIM/NÃO' })
  mdi: boolean;

  @Column({ type: 'int', name: 'mdi_max', comment: 'NÚMERO MÁXIMO DE JANELAS MDI' })
  mdiMax: number;

  @Column({ type: 'boolean', name: 'group_rule', default: false, comment: 'PRIORIZA REGRA DO GRUPO SIM/NÃO' })
  groupRule: boolean;

  @Column({ type: 'boolean', default: false })
  isAcceptedTerms: boolean;

  @Column({ type: 'boolean', name: 'su', default: false, comment: 'Usuário é  SU - Super Usuário' })
  su: boolean;

  // members são os grupos que o usuário participa
  @OneToMany(() => Member, (member) => member.user)
  members: Member[];

  //   // Usuários que foram criados por um usuário
  @OneToMany(() => UserEntity, (user) => user.createdBy, { nullable: true, onDelete: 'SET NULL' })
  createdUsers: UserEntity[];

  // Usuários que foram editados por um usuário
  @OneToMany(() => UserEntity, (user) => user.updatedBy, { nullable: true, onDelete: 'SET NULL' })
  updatedUsers: UserEntity[];

  // Usuário que criou o usuário
  @ManyToOne(() => UserEntity, (user) => user.createdUsers)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  createdBy: UserEntity;

  // Usuário que atualizou o usuário
  @ManyToOne(() => UserEntity, (user) => user.updatedUsers)
  @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
  updatedBy: UserEntity;

  // Grupos criados pelo usuário
  @OneToMany(() => UserGroupEntity, (group) => group.createdBy, { nullable: true, onDelete: 'SET NULL' })
  createdGroups: UserGroupEntity[];

  // Grupos atualizados pelo usuário
  @OneToMany((type) => UserGroupEntity, (group) => group.updatedBy, { nullable: true, onDelete: 'SET NULL' })
  updatedGroups: UserGroupEntity[];

  // Menu itens criados pelo usuário
  @OneToMany((type) => MenuItem, (menuItem) => menuItem.createdBy, { nullable: true, onDelete: 'SET NULL' })
  createdMenuItens: MenuItem[];

  // Menu itens atualizados pelo usuário
  @OneToMany((type) => MenuItem, (menuItem) => menuItem.updatedBy, { nullable: true, onDelete: 'SET NULL' })
  updatedMenuItens: MenuItem[];

  // Grupos de Menus criados pelo usuário
  @OneToMany((type) => MenuGroup, (menuGrup) => menuGrup.createdBy, { nullable: true, onDelete: 'SET NULL' })
  createdMenuGroup: MenuGroup[];

  // Grupos de Menus atualizados pelo usuário
  @OneToMany((type) => MenuGroup, (menuGroup) => menuGroup.updatedBy, { nullable: true, onDelete: 'SET NULL' })
  updatedMenuGroup: MenuGroup[];

  // Contas criadas pelo usuário
  @OneToMany((type) => Account, (account) => account.createdBy, { nullable: true, onDelete: 'SET NULL' })
  createdAccounts: Account[];

  // Contas atualizadas pelo usuário
  @OneToMany((type) => Account, (account) => account.updatedBy, { nullable: true, onDelete: 'SET NULL' })
  updatedAccounts: Account[];

  // Parametros criados pelo usuário
  @OneToMany((type) => Parameter, (parameter) => parameter.createdBy, { nullable: true, onDelete: 'SET NULL' })
  createdParameters: Parameter[];

  // Parametros atualizados pelo usuário
  @OneToMany((type) => Parameter, (parameter) => parameter.updatedBy, { nullable: true, onDelete: 'SET NULL' })
  updatedParameters: Parameter[];
}

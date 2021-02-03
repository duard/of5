import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Account } from './account.entity';
import { Member } from './member.entity';
import { MenuGroup } from './menu-group.entity';
import { MenuItem } from './menu-item.entity';
import { Parameter } from './parameter.entity';
import { DefaultColumns } from './sdefcol';
import { UserGroup } from './user-group.entity';

@Entity({ name: 'users' })
export class User extends DefaultColumns {
  @Column({ type: 'varchar', length: 20, name: 'st_username', comment: 'NOME' })
  username: string;

  @Column({ type: 'varchar', length: 50, name: 'st_email', comment: 'EMAIL' })
  email: string;

  @Column({ type: 'varchar', length: 100, name: 'st_password', select: false, comment: 'SENHA' })
  password: string;

  @Column({ type: 'varchar', length: 250, name: 'st_facebook', comment: 'FACEBOOK' })
  facebook: string;

  @Column({ type: 'varchar', length: 250, name: 'st_instagram', comment: 'INSTAGRAM' })
  instagram: string;

  @Column({ type: 'varchar', length: 250, name: 'st_linkedin', comment: 'LINKEDIN' })
  linkedin: string;

  @Column({ type: 'varchar', length: 250, name: 'st_skype', comment: 'SKYPE' })
  skype: string;

  @Column({ type: 'varchar', name: 'st_url_photo', comment: 'URL FOTO', nullable: true })
  urlPhoto: string;

  @Column({ type: 'varchar', name: 'st_uuid_s3', comment: 'Identificação da foto na s3', nullable: true })
  uuid: string;

  @Column({ type: 'varchar', length: 25, name: 'st_phone', comment: 'TELEFONE' })
  phone: string;

  @Column({ type: 'date', name: 'dt_bithday', comment: 'DATA DE NASCIMENTO' })
  birthday: Date;

  @Column({ type: 'timestamptz', name: 'dt_pass_expiration', nullable: true, comment: 'DATA DE EXPIRAÇÃO DA SENHA' })
  passExpiration: Date;

  @Column({ type: 'boolean', name: 'bn_pass_change', default: false, comment: 'TROCAR SENHA SIM/NÃO' })
  passChange: boolean;

  @Column({
    type: 'int',
    name: 'in_pass_days_change',
    nullable: true,
    comment: 'TROCAR SENHA PERIÓDICAMENTE A CADA N DIAS'
  })
  passDaysChange: number;

  @Column({ type: 'int', name: 'in_timeout', comment: 'TIMEOUT EM MINUTOS' })
  timeout: number;

  @Column({ type: 'boolean', name: 'bn_mdi', comment: 'UTILIZA MDI SIM/NÃO' })
  mdi: boolean;

  @Column({ type: 'int', name: 'in_mdi_max', comment: 'NÚMERO MÁXIMO DE JANELAS MDI' })
  mdiMax: number;

  @Column({ type: 'boolean', name: 'bn_group_rule', default: false, comment: 'PRIORIZA REGRA DO GRUPO SIM/NÃO' })
  groupRule: boolean;

  @Column({ type: 'boolean', default: false })
  isAcceptedTerms: boolean;

  @Column({ type: 'boolean', name: 'bn_su', default: false, comment: 'Usuário é  SU - Super Usuário' })
  su: boolean;

  // members são os grupos que o usuário participa
  @OneToMany((type) => Member, (member) => member.user)
  members: Member[];

  // Usuários que foram criados por um usuário
  @OneToMany((type) => User, (user) => user.createdBy, { nullable: true, onDelete: 'SET NULL' })
  createdUsers: User[];

  // Usuários que foram editados por um usuário
  @OneToMany((type) => User, (user) => user.updatedBy, { nullable: true, onDelete: 'SET NULL' })
  updatedUsers: User[];

  // Usuário que criou o usuário
  @ManyToOne((type) => User, (user) => user.createdUsers)
  @JoinColumn({ name: 'in_created_by', referencedColumnName: 'id' })
  createdBy: User;

  // Usuário que atualizou o usuário
  @ManyToOne((type) => User, (user) => user.updatedUsers)
  @JoinColumn({ name: 'in_updated_by', referencedColumnName: 'id' })
  updatedBy: User;

  // Grupos criados pelo usuário
  @OneToMany((type) => UserGroup, (group) => group.createdBy, { nullable: true, onDelete: 'SET NULL' })
  createdGroups: UserGroup[];

  // Grupos atualizados pelo usuário
  @OneToMany((type) => UserGroup, (group) => group.updatedBy, { nullable: true, onDelete: 'SET NULL' })
  updatedGroups: UserGroup[];

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

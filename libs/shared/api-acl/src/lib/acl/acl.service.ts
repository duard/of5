import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as arrayToTree from 'array-to-tree';
import { createQueryBuilder, getTreeRepository, Repository } from 'typeorm';

import { ActionEntity, UserEntity } from '../..';
import { AclData } from '../acl-data.interface';
import { ActionScreenEntity } from '../action-screen/action-screen.entity';
import { FilterEntity } from '../filter/filter.entity';
import { MemberEntity } from '../member/member.entity';
import { RoleActionEntity } from '../role-action/role-action.entity';
import { RoleFilterEntity } from '../role-filter/role-filter.entity';
import { RoleGroupEntity } from '../role-group/roule-group.entity';
import { RoleScreenEntity } from '../role-screen/role-screen.entity';
import { RoleEntity } from '../role/role.entity';
import { ScreenEntity } from '../screen/screen.entity';
import { UserGroupEntity } from '../user-group/user-group.entity';
import {
  AssociateActionsWithRoleDTO,
  AssociateFiltersWithRoleDTO,
  AssociateGroupWithRolesDTO,
  AssociateGroupWithUsersDTO,
  AssociateScreensWithRoleDTO,
  AssociateScreenWithActionsDTO,
  AssociateUserWithGroupsDTO,
  CanAccessDTO
} from './acl.dto';

@Injectable()
export class AclService {
  constructor(
    @InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>,
    @InjectRepository(FilterEntity) private filterRepo: Repository<FilterEntity>,
    @InjectRepository(RoleFilterEntity) private roleFilterRepo: Repository<RoleFilterEntity>,
    @InjectRepository(ActionEntity) private actionRepo: Repository<ActionEntity>,
    @InjectRepository(RoleActionEntity) private roleActionRepo: Repository<RoleActionEntity>,
    @InjectRepository(ScreenEntity) private screenRepo: Repository<ScreenEntity>,
    @InjectRepository(RoleScreenEntity) private roleScreenRepo: Repository<RoleScreenEntity>,
    @InjectRepository(MemberEntity) private memberRepo: Repository<MemberEntity>,
    @InjectRepository(UserGroupEntity) private userGroupRepo: Repository<UserGroupEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(RoleGroupEntity) private roleGroupRepo: Repository<RoleGroupEntity>,
    @InjectRepository(ActionScreenEntity) private actionScreenRepo: Repository<ActionScreenEntity>
  ) {}

  /**
   * Obter todos os menus do usuário autenticado
   */
  async getMenus(user: UserEntity) {
    const menus = await this.screenRepo
      .createQueryBuilder('screen')
      .leftJoinAndSelect('screen.roleScreens', 'roleScreen')
      .leftJoinAndSelect('roleScreen.role', 'role')
      .leftJoinAndSelect('role.roleGroups', 'roleGroup')
      .leftJoinAndSelect('roleGroup.group', 'group')
      .leftJoinAndSelect('group.members', 'member')
      .leftJoinAndSelect('member.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getMany();

    return await this.buildTreeMenu(menus);
  }

  /**
   * Associar filtros com um papel
   */
  async associateFiltersWithRole(dto: AssociateFiltersWithRoleDTO) {
    const role = await this.roleRepo.findOne(dto.role);

    if (!role) {
      throw new HttpException('Informe um Role válido', HttpStatus.NOT_FOUND);
    }

    const filters = await this.filterRepo.findByIds(dto.filters);

    const qb = createQueryBuilder(RoleFilterEntity, 'roleFilter');

    await qb.leftJoinAndSelect('roleFilter.role', 'role').delete().where('role.id = :id', { id: role.id }).execute();

    const toSave: RoleFilterEntity[] = [];

    for (const f of filters) {
      toSave.push(new RoleFilterEntity(role, f));
    }

    return await this.roleFilterRepo.save(toSave);
  }

  /**
   * Associar ações com uma Role
   */
  async associateActionsWithRole(dto: AssociateActionsWithRoleDTO) {
    const role = await this.roleRepo.findOne(dto.role);

    if (!role) {
      throw new HttpException('Informe um Role válida', HttpStatus.NOT_FOUND);
    }

    const actions = await this.actionRepo.findByIds(dto.actions);

    const qb = createQueryBuilder(RoleActionEntity, 'roleAction');

    await qb.leftJoinAndSelect('roleAction.role', 'role').delete().where('role.id = :id', { id: role.id }).execute();

    const toSave: RoleActionEntity[] = [];

    for (const action of actions) {
      toSave.push(new RoleActionEntity(role, action));
    }

    return await this.roleActionRepo.save(toSave);
  }

  /**
   * Associar ações com uma tela
   */
  async associateScreenWithActions(dto: AssociateScreenWithActionsDTO) {
    const screen = await this.screenRepo.findOne(dto.screen);

    if (!screen) {
      throw new HttpException('Informe uma screen válida', HttpStatus.NOT_FOUND);
    }

    const actions = await this.actionRepo.findByIds(dto.actions);

    const qb = createQueryBuilder(ActionScreenEntity, 'actionScreen');

    await qb
      .leftJoinAndSelect('actionScreen.screen', 'screen')
      .delete()
      .where('screen.screenId = :screenId', { screenId: screen.screenId })
      .execute();

    const toSave: ActionScreenEntity[] = [];

    for (const action of actions) {
      toSave.push(new ActionScreenEntity(screen, action));
    }

    return await this.actionScreenRepo.save(toSave);
  }

  /**
   * Associar telas com um papel
   */
  async associateScreensWithRole(dto: AssociateScreensWithRoleDTO) {
    const role = await this.roleRepo.findOne(dto.role);

    if (!role) {
      throw new HttpException('Informe um Role válido', HttpStatus.NOT_FOUND);
    }

    const screens = await this.screenRepo.findByIds(dto.screens);

    const qb = createQueryBuilder(RoleScreenEntity, 'roleScreen');

    await qb.leftJoinAndSelect('roleScreen.role', 'role').delete().where('role.id = :id', { id: role.id }).execute();

    const toSave: RoleScreenEntity[] = [];

    for (const screen of screens) {
      toSave.push(new RoleScreenEntity(role, screen));
    }

    return await this.roleScreenRepo.save(toSave);
  }

  /**
   * Associar telas com um papel
   */
  async associateGroupWithRoles(dto: AssociateGroupWithRolesDTO) {
    const group = await this.userGroupRepo.findOne(dto.group);

    if (!group) {
      throw new HttpException('Informe um grupo válido', HttpStatus.NOT_FOUND);
    }

    const roles = await this.roleRepo.findByIds(dto.roles);

    const qb = createQueryBuilder(RoleGroupEntity, 'roleGroup');

    await qb
      .leftJoinAndSelect('roleGroup.group', 'group')
      .delete()
      .where('group.id = :groupId', { groupId: group.id })
      .execute();

    const toSave: RoleGroupEntity[] = [];

    for (const role of roles) {
      toSave.push(new RoleGroupEntity(group, role));
    }

    return await this.roleGroupRepo.save(toSave);
  }

  /**
   * Associar usuário com grupos
   */
  async userGroups(dto: AssociateUserWithGroupsDTO) {
    const user = await this.userRepo.findOne(dto.user);

    if (!user) {
      throw new HttpException('Informe um usuário válido', HttpStatus.NOT_FOUND);
    }

    const groups = await this.userGroupRepo.findByIds(dto.groups);

    const qb = createQueryBuilder(MemberEntity, 'member');

    await qb
      .leftJoinAndSelect('member.user', 'user')
      .delete()
      .where('user.id = :userId', { userId: dto.user })
      .execute();

    const toSave: MemberEntity[] = [];

    for (const group of groups) {
      toSave.push(new MemberEntity(user, group));
    }

    return await this.memberRepo.save(toSave);
  }

  /**
   * Associar um grupo com usuários
   */
  async groupUsers(dto: AssociateGroupWithUsersDTO) {
    const group = await this.userGroupRepo.findOne(dto.group);

    if (!group) {
      throw new HttpException('Informe um grupo válido', HttpStatus.NOT_FOUND);
    }

    const users = await this.userRepo.findByIds(dto.users);

    const qb = createQueryBuilder(MemberEntity, 'member');

    await qb
      .leftJoinAndSelect('member.group', 'group')
      .delete()
      .where('group.id = :groupId', { groupId: group.id })
      .execute();

    const toSave: MemberEntity[] = [];

    for (const user of users) {
      toSave.push(new MemberEntity(user, group));
    }

    return await this.memberRepo.save(toSave);
  }

  /**
   * Listar todas as telas com suas ações do usuário logado
   */
  async getActions(user: UserEntity) {
    const usr = await this.userRepo.findOne(user.id);

    if (!usr) {
      throw new HttpException('Informe um usuário válido', HttpStatus.NOT_FOUND);
    }

    const screenWithActions = await createQueryBuilder(ScreenEntity, 'screen')
      .leftJoinAndSelect('screen.parent', 'parent')
      .leftJoinAndSelect('screen.roleScreens', 'roleScreen')
      .leftJoinAndSelect('roleScreen.role', 'role')
      .leftJoinAndSelect('role.roleActions', 'roleAction')
      .leftJoinAndSelect('roleAction.action', 'action')
      .leftJoinAndSelect('role.roleGroups', 'roleGroup')
      .leftJoinAndSelect('roleGroup.group', 'group')
      .leftJoinAndSelect('group.members', 'member')
      .leftJoinAndSelect('member.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getMany();

    screenWithActions.forEach((screen) => {
      const actions: ActionEntity[] = [];
      const alreadyAdd: number[] = [];

      if (screen.parent) {
        screen.roleScreens.forEach((rs) => {
          rs.role.roleActions.forEach((ra) => {
            if (!alreadyAdd.includes(ra.action.actionId)) {
              actions.push(ra.action);
            }
          });
        });
        screen['actions'] = actions;
      }
    });

    screenWithActions.forEach((screen) => {
      delete screen.roleScreens;
      delete screen.parent;
      // delete screen.childScreens;
    });

    return screenWithActions;
  }

  /**
   * Verifica se um usuário tem permissão para realizar alguma ação.
   */
  async aclData(user: UserEntity, actionKey: string, screenKey: string): Promise<AclData> {
    const usr = await this.userRepo.findOne(user.id);

    if (!usr) {
      return { canActivate: false, actions: [] };
    }

    // Permissão para a tela
    // Com isso pode fazer o find all
    if (actionKey == 'ALL') {
      const hasPermission = await createQueryBuilder(Screen, 'screen')
        .leftJoinAndSelect('screen.roleScreens', 'roleScreen')
        .leftJoinAndSelect('roleScreen.role', 'role')
        .leftJoinAndSelect('role.roleActions', 'roleAction')
        .leftJoinAndSelect('roleAction.action', 'action')
        .leftJoinAndSelect('role.roleGroups', 'roleGroup')
        .leftJoinAndSelect('roleGroup.group', 'group')
        .leftJoinAndSelect('group.members', 'member')
        .leftJoinAndSelect('member.user', 'user')
        .where('user.id = :userId AND screen.key = :screenKey', { userId: user.id, screenKey })
        .getCount();

      if (hasPermission) {
        const actions = await createQueryBuilder(ActionEntity, 'action')
          .leftJoinAndSelect('action.roleActions', 'roleAction')
          .leftJoinAndSelect('roleAction.role', 'role')
          .leftJoinAndSelect('role.roleScreens', 'roleScreen')
          .leftJoinAndSelect('roleScreen.screen', 'screen')
          .leftJoinAndSelect('role.roleGroups', 'roleGroup')
          .leftJoinAndSelect('roleGroup.group', 'group')
          .leftJoinAndSelect('group.members', 'member')
          .leftJoinAndSelect('member.user', 'user')
          .where('user.id = :userId AND screen.key = :screenKey', { userId: user.id, screenKey })
          .getMany();

        const actionsScreen = await createQueryBuilder(ActionEntity, 'action')
          .leftJoinAndSelect('action.actionsScreen', 'as')
          .leftJoinAndSelect('as.screen', 'screen')
          .where('screen.key = :key', { key: screenKey })
          .getMany();

        const specificActions: ActionEntity[] = [];

        actionsScreen.forEach((a) => {
          delete a.roleActions;
          delete a.actionsScreen;
          const contains: number = actions.filter((allActions) => allActions.actionId == a.actionId).length;
          if (contains) {
            specificActions.push(a);
          }
        });

        return { canActivate: true, actions: specificActions };
      }

      return { canActivate: false, actions: [] };
    }

    const hasPermission = await createQueryBuilder(ScreenEntity, 'screen')
      .leftJoinAndSelect('screen.actionsScreen', 'actionScreen')
      .leftJoinAndSelect('actionScreen.action', 'specificAction')
      .leftJoinAndSelect('screen.roleScreens', 'roleScreen')
      .leftJoinAndSelect('roleScreen.role', 'role')
      .leftJoinAndSelect('role.roleActions', 'roleAction')
      .leftJoinAndSelect('roleAction.action', 'action')
      .leftJoinAndSelect('role.roleGroups', 'roleGroup')
      .leftJoinAndSelect('roleGroup.group', 'group')
      .leftJoinAndSelect('group.members', 'member')
      .leftJoinAndSelect('member.user', 'user')
      .where(
        'user.id = :userId AND screen.key = :screenKey AND action.key = :actionKey AND specificAction.key = :specific',
        { userId: user.id, screenKey, actionKey, specific: actionKey }
      )
      .getCount();

    if (hasPermission) {
      const actions = await createQueryBuilder(ActionEntity, 'action')
        .leftJoinAndSelect('action.roleActions', 'roleAction')
        .leftJoinAndSelect('roleAction.role', 'role')
        .leftJoinAndSelect('role.roleScreens', 'roleScreen')
        .leftJoinAndSelect('roleScreen.screen', 'screen')
        .leftJoinAndSelect('role.roleGroups', 'roleGroup')
        .leftJoinAndSelect('roleGroup.group', 'group')
        .leftJoinAndSelect('group.members', 'member')
        .leftJoinAndSelect('member.user', 'user')
        .where('user.id = :userId AND screen.key = :screenKey', { userId: user.id, screenKey })
        .getMany();

      actions.forEach((a) => {
        delete a.roleActions;
      });

      return { canActivate: true, actions };
    }

    return { canActivate: false, actions: [] };
  }

  private async buildTreeMenu(menus: ScreenEntity[]) {
    const idsToMap: number[] = [];

    for (const menu of menus) {
      const parents = await getTreeRepository(ScreenEntity).findAncestorsTree(menu);

      getParentIds(parents);
      // eslint-disable-next-line no-inner-declarations
      function getParentIds(m: ScreenEntity) {
        if (m.parent) {
          getParentIds(m.parent);
        }
        idsToMap.push(m.screenId);
      }
    }

    const associatedParents = await this.screenRepo.findByIds(idsToMap, { relations: ['parent'] }).then((menu) => {
      return menu.map((m) => {
        m['parentId'] = m.parent?.screenId ? m.parent.screenId : null;
        delete m.parent;
        return m;
      });
    });

    return arrayToTree(associatedParents, {
      parentProperty: 'parentId',
      childrenProperty: 'children',
      customID: 'screenId'
    });
  }

  /**
   * Usuário tem permissão para tela?
   * @param user
   * @param CanAccessDTO
   * @returns boolean
   */
  async canAccess(user: UserEntity, dto: CanAccessDTO) {
    const canAccess = await createQueryBuilder(Screen, 'screen')
      .leftJoinAndSelect('screen.roleScreens', 'roleScreen')
      .leftJoinAndSelect('roleScreen.role', 'role')
      .leftJoinAndSelect('role.roleGroups', 'roleGroup')
      .leftJoinAndSelect('roleGroup.group', 'group')
      .leftJoinAndSelect('group.members', 'member')
      .leftJoinAndSelect('member.user', 'user')
      .where('user.id = :userId AND screen.key = :screen', { userId: user.id, screen: dto.screen })
      .getCount();

    if (canAccess) {
      return true;
    }

    return false;
  }
}

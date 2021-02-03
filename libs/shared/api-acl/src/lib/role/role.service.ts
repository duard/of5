import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Exception } from 'handlebars';
import { QueryResolver } from 'nestjs-i18n';
import { CreateRoleDTO, UpdateRoleDTO } from 'src/dtos/role.dto';
import { Action } from 'src/entities/action.entity';
import { Filter } from 'src/entities/filter.entity';
import { RoleAction } from 'src/entities/role-action.entity';
import { RoleFilter } from 'src/entities/role-filter.entity';
import { RoleScreen } from 'src/entities/role-screen.entity';
import { Role } from 'src/entities/role.entity';
import { Screen } from 'src/entities/screen.entity';
import { User } from 'src/entities/user.entity';
import { Connection, createQueryBuilder, Equal, getRepository, Not, Repository } from 'typeorm';
import { SetFiltersDTO } from '../acl/acl.dto';
import { ErrorService } from '../error/error.service';

@Injectable()
export class RoleService extends TypeOrmCrudService<Role> {
  constructor(
    @InjectRepository(Role) protected repo: Repository<Role>,
    @InjectRepository(Screen) protected repoScreen: Repository<Screen>,
    @InjectRepository(Action) protected repoAction: Repository<Action>,
    private connection: Connection
  ) {
    super(repo);
  }

  async create(dto: CreateRoleDTO) {
    const qr = this.connection.createQueryRunner();
    try {
      await qr.connect();
      await qr.startTransaction();

      const exists = await this.repo
        .createQueryBuilder('role')
        .where('UPPER(role.name) = UPPER(:name)', { name: dto.name })
        .getOne();

      if (exists) {
        throw new HttpException('Role já existe', HttpStatus.BAD_REQUEST);
      }

      const toSave = this.repo.create({ name: dto.name });

      const savedRole = await qr.manager.getRepository(Role).save(toSave);

      const screens = await qr.manager.getRepository(Screen).findByIds(dto.screens);

      if (!screens.length) {
        throw new HttpException('Informe ao menos uma Screen', HttpStatus.BAD_REQUEST);
      }

      const roleScreens: RoleScreen[] = [];

      screens.forEach((s) => {
        roleScreens.push(new RoleScreen(savedRole, s));
      });

      await qr.manager.getRepository(RoleScreen).save(roleScreens);

      const actions = await qr.manager.getRepository(Action).findByIds(dto.actions);

      if (!actions.length) {
        throw new HttpException('Informe ao menos uma Action', HttpStatus.BAD_REQUEST);
      }

      const roleActions: RoleAction[] = [];

      actions.forEach((a) => {
        roleActions.push(new RoleAction(savedRole, a));
      });

      await qr.manager.getRepository(RoleAction).save(roleActions);

      await qr.commitTransaction();
    } catch (err) {
      await ErrorService.next(err, qr);
    } finally {
      await qr.release();
    }
  }

  async getFiltersThisRole(id: number) {
    if (!(await this.repo.findOne(id))) {
      throw new HttpException('Role não encontrado', HttpStatus.NOT_FOUND);
    }

    const filters = await createQueryBuilder(Filter, 'filter')
      .leftJoinAndSelect('filter.roleFilters', 'roleFilters')
      .leftJoinAndSelect('roleFilters.role', 'role')
      .where('role.roleId = :roleId', { roleId: id })
      .getMany();

    filters.forEach((f) => delete f.roleFilters);

    return filters;
  }

  async update(id: number, dto: UpdateRoleDTO) {
    const qr = this.connection.createQueryRunner();
    try {
      await qr.connect();
      await qr.startTransaction();

      const exists = await this.repo
        .createQueryBuilder('role')
        .where('UPPER(role.name) = UPPER(:name) AND role.roleId <> :id', { name: dto.name, id })
        .getOne();

      if (exists) {
        throw new HttpException('Role já existe', HttpStatus.BAD_REQUEST);
      }

      if (dto.name) {
        const toEdit = this.repo.create({ name: dto.name });
        await qr.manager.getRepository(Role).update(id, toEdit);
      }

      const role = new Role();
      role.roleId = id;

      if (dto.screens.length) {
        const screens = await qr.manager.getRepository(Screen).findByIds(dto.screens);

        const roleScreens: RoleScreen[] = [];

        screens.forEach((s) => {
          roleScreens.push(new RoleScreen(role, s));
        });

        await qr.manager
          .createQueryBuilder(RoleScreen, 'roleScreen')
          .leftJoinAndSelect('roleScreen.role', 'role')
          .delete()
          .where('role.roleId = :roleId', { roleId: id })
          .execute();

        await qr.manager.getRepository(RoleScreen).save(roleScreens);
      }

      if (dto.actions.length) {
        const actions = await qr.manager.getRepository(Action).findByIds(dto.actions);

        const roleActions: RoleAction[] = [];

        actions.forEach((a) => {
          roleActions.push(new RoleAction(role, a));
        });

        await qr.manager
          .createQueryBuilder(RoleAction, 'roleAction')
          .leftJoinAndSelect('roleAction.role', 'role')
          .delete()
          .where('role.roleId = :roleId', { roleId: id })
          .execute();

        await qr.manager.getRepository(RoleAction).save(roleActions);
      }

      await qr.commitTransaction();
    } catch (err) {
      await ErrorService.next(err, qr);
    } finally {
      await qr.release();
    }
  }

  async createOrReplaceFilters(roleId: number, dto: SetFiltersDTO) {
    const qr = this.connection.createQueryRunner();
    try {
      await qr.connect();
      await qr.startTransaction();

      // Validar o objeto de DTO
      this.validateSetFiltersDto(dto);

      const role = await qr.manager.getRepository(Role).findOne(roleId);

      if (!role) {
        throw new HttpException('Role inválido', HttpStatus.BAD_REQUEST);
      }

      const filters = await createQueryBuilder(Filter, 'filter')
        .leftJoinAndSelect('filter.roleFilters', 'roleFilters')
        .leftJoinAndSelect('roleFilters.role', 'role')
        .where('role.roleId = :roleId', { roleId })
        .getMany();

      const filterIds = filters.map((f) => f.filterId);

      if (filterIds.length) {
        await getRepository(Filter).delete(filterIds);
      }

      for (const screen of dto.screens) {
        const filters: Filter[] = [];

        for (const filterChild of screen.filters) {
          const atualScreen = await qr.manager.getRepository(Screen).findOne(screen.screen);

          if (atualScreen) {
            filters.push(
              new Filter({
                fieldName: filterChild.field,
                operation: filterChild.op,
                value: filterChild.value,
                screen: atualScreen
              })
            );
          }
        }

        if (filters.length) {
          const savedFilters = await qr.manager.getRepository(Filter).save(filters);

          const roleFilters: RoleFilter[] = [];

          savedFilters.forEach((sf) => {
            roleFilters.push(new RoleFilter(role, sf));
          });

          await qr.manager
            .getRepository(RoleFilter)
            .createQueryBuilder('roleFilter')
            .leftJoin('roleFilter.role', 'role')
            .delete()
            .where('role = :roleId', { roleId: role.roleId })
            .execute();

          await qr.manager.getRepository(RoleFilter).save(roleFilters);
        }
      }
      return;
    } catch (err) {
      await ErrorService.next(err, qr);
    } finally {
      await qr.release();
    }
  }

  async deleteFilter(roleId: number, filterId: number) {
    if (!(await this.repo.findOne(roleId))) {
      throw new HttpException('Role não encontrado', HttpStatus.NOT_FOUND);
    }

    const filterToDelete = await createQueryBuilder(Filter, 'filter')
      .leftJoinAndSelect('filter.roleFilters', 'roleFilters')
      .leftJoinAndSelect('roleFilters.role', 'role')
      .where('role.roleId = :roleId AND filter.filterId = :filterId', { roleId, filterId })
      .getOne();

    if (!filterToDelete) {
      throw new HttpException('Filter não encontrado', HttpStatus.NOT_FOUND);
    }

    await getRepository(Filter).delete(filterToDelete.filterId);

    return;
  }

  async deleteAllFilters(roleId: number) {
    if (!(await this.repo.findOne(roleId))) {
      throw new HttpException('Role não encontrado', HttpStatus.NOT_FOUND);
    }

    const filterToDelete = await createQueryBuilder(Filter, 'filter')
      .leftJoinAndSelect('filter.roleFilters', 'roleFilters')
      .leftJoinAndSelect('roleFilters.role', 'role')
      .where('role.roleId = :roleId', { roleId })
      .getMany();

    const filterIds = filterToDelete.map((f) => f.filterId);

    if (filterIds.length) {
      await getRepository(Filter).delete(filterIds);
    }

    return;
  }

  validateSetFiltersDto(dto: SetFiltersDTO) {
    if (!dto.screens.length) {
      throw new HttpException('Informe ao menos uma tela e seus filtros', HttpStatus.BAD_REQUEST);
    }

    dto.screens.forEach((s) => {
      if (!s.screen || typeof s.screen != 'number') {
        throw new HttpException('Informe uma screen válida', HttpStatus.BAD_REQUEST);
      }
      if (!s.filters || !Array.isArray(s.filters)) {
        throw new HttpException('Informe uma lista de filtros válida', HttpStatus.BAD_REQUEST);
      }

      if (s.filters && Array.isArray(s.filters)) {
        s.filters.forEach((f) => {
          if (!f.field || !f.op) {
            throw new HttpException('Field e op são obrigatórios', HttpStatus.BAD_REQUEST);
          }
        });
      }
    });
  }
}

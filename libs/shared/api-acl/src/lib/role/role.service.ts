import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ErrorService } from '@of5/shared/api-shared';
import { Connection, createQueryBuilder, getRepository, Repository } from 'typeorm';

import { SetFiltersDTO } from '../acl/acl.dto';
import { ActionEntity } from '../action/action.entity';
import { FilterEntity } from '../filter/filter.entity';
import { RoleActionEntity } from '../role-action/role-action.entity';
import { RoleFilterEntity } from '../role-filter/role-filter.entity';
import { RoleScreenEntity } from '../role-screen/role-screen.entity';
import { ScreenEntity } from '../screen/screen.entity';
import { CreateRoleDTO, UpdateRoleDTO } from './role.dto';
import { RoleEntity } from './role.entity';

@Injectable()
export class RoleService extends TypeOrmCrudService<RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity) protected repo: Repository<RoleEntity>,
    @InjectRepository(ScreenEntity) protected repoScreen: Repository<ScreenEntity>,
    @InjectRepository(ActionEntity) protected repoAction: Repository<ActionEntity>,
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

      const savedRole = await qr.manager.getRepository(RoleEntity).save(toSave);

      const screens = await qr.manager.getRepository(ScreenEntity).findByIds(dto.screens);

      if (!screens.length) {
        throw new HttpException('Informe ao menos uma Screen', HttpStatus.BAD_REQUEST);
      }

      const roleScreens: RoleScreenEntity[] = [];

      screens.forEach((s) => {
        roleScreens.push(new RoleScreenEntity(savedRole, s));
      });

      await qr.manager.getRepository(RoleScreenEntity).save(roleScreens);

      const actions = await qr.manager.getRepository(ActionEntity).findByIds(dto.actions);

      if (!actions.length) {
        throw new HttpException('Informe ao menos uma Action', HttpStatus.BAD_REQUEST);
      }

      const roleActions: RoleActionEntity[] = [];

      actions.forEach((a) => {
        roleActions.push(new RoleActionEntity(savedRole, a));
      });

      await qr.manager.getRepository(RoleActionEntity).save(roleActions);

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

    const filters = await createQueryBuilder(FilterEntity, 'filter')
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
        await qr.manager.getRepository(RoleEntity).update(id, toEdit);
      }

      const role = new RoleEntity();
      role.roleId = id;

      if (dto.screens.length) {
        const screens = await qr.manager.getRepository(ScreenEntity).findByIds(dto.screens);

        const roleScreens: RoleScreenEntity[] = [];

        screens.forEach((s) => {
          roleScreens.push(new RoleScreenEntity(role, s));
        });

        await qr.manager
          .createQueryBuilder(RoleScreenEntity, 'roleScreen')
          .leftJoinAndSelect('roleScreen.role', 'role')
          .delete()
          .where('role.roleId = :roleId', { roleId: id })
          .execute();

        await qr.manager.getRepository(RoleScreenEntity).save(roleScreens);
      }

      if (dto.actions.length) {
        const actions = await qr.manager.getRepository(ActionEntity).findByIds(dto.actions);

        const roleActions: RoleActionEntity[] = [];

        actions.forEach((a) => {
          roleActions.push(new RoleActionEntity(role, a));
        });

        await qr.manager
          .createQueryBuilder(RoleActionEntity, 'roleAction')
          .leftJoinAndSelect('roleAction.role', 'role')
          .delete()
          .where('role.roleId = :roleId', { roleId: id })
          .execute();

        await qr.manager.getRepository(RoleActionEntity).save(roleActions);
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

      const role = await qr.manager.getRepository(RoleEntity).findOne(roleId);

      if (!role) {
        throw new HttpException('Role inválido', HttpStatus.BAD_REQUEST);
      }

      const filters = await createQueryBuilder(FilterEntity, 'filter')
        .leftJoinAndSelect('filter.roleFilters', 'roleFilters')
        .leftJoinAndSelect('roleFilters.role', 'role')
        .where('role.roleId = :roleId', { roleId })
        .getMany();

      const filterIds = filters.map((f) => f.filterId);

      if (filterIds.length) {
        await getRepository(FilterEntity).delete(filterIds);
      }

      for (const screen of dto.screens) {
        const filters: FilterEntity[] = [];

        for (const filterChild of screen.filters) {
          const atualScreen = await qr.manager.getRepository(ScreenEntity).findOne(screen.screen);

          if (atualScreen) {
            filters.push(
              new FilterEntity({
                fieldName: filterChild.field,
                operation: filterChild.op,
                value: filterChild.value,
                screen: atualScreen
              })
            );
          }
        }

        if (filters.length) {
          const savedFilters = await qr.manager.getRepository(FilterEntity).save(filters);

          const roleFilters: RoleFilterEntity[] = [];

          savedFilters.forEach((sf) => {
            roleFilters.push(new RoleFilterEntity(role, sf));
          });

          await qr.manager
            .getRepository(RoleFilterEntity)
            .createQueryBuilder('roleFilter')
            .leftJoin('roleFilter.role', 'role')
            .delete()
            .where('role = :roleId', { roleId: role.roleId })
            .execute();

          await qr.manager.getRepository(RoleFilterEntity).save(roleFilters);
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

    const filterToDelete = await createQueryBuilder(FilterEntity, 'filter')
      .leftJoinAndSelect('filter.roleFilters', 'roleFilters')
      .leftJoinAndSelect('roleFilters.role', 'role')
      .where('role.roleId = :roleId AND filter.filterId = :filterId', { roleId, filterId })
      .getOne();

    if (!filterToDelete) {
      throw new HttpException('Filter não encontrado', HttpStatus.NOT_FOUND);
    }

    await getRepository(FilterEntity).delete(filterToDelete.filterId);

    return;
  }

  async deleteAllFilters(roleId: number) {
    if (!(await this.repo.findOne(roleId))) {
      throw new HttpException('Role não encontrado', HttpStatus.NOT_FOUND);
    }

    const filterToDelete = await createQueryBuilder(FilterEntity, 'filter')
      .leftJoinAndSelect('filter.roleFilters', 'roleFilters')
      .leftJoinAndSelect('roleFilters.role', 'role')
      .where('role.roleId = :roleId', { roleId })
      .getMany();

    const filterIds = filterToDelete.map((f) => f.filterId);

    if (filterIds.length) {
      await getRepository(FilterEntity).delete(filterIds);
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

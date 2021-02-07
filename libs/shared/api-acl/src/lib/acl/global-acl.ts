import { CallHandler, ExecutionContext, HttpException, HttpStatus, Logger, NestInterceptor } from '@nestjs/common';
import { ACL_ACTION, ACTION_TYPE } from '@of5/shared/api-shared';
import { User } from 'aws-sdk/clients/appstream';
import { Observable } from 'rxjs';
import { Action } from 'rxjs/internal/scheduler/Action';
import { catchError, map } from 'rxjs/operators';
import { createQueryBuilder, getConnection } from 'typeorm';
import {
  RoleEntity,
  FilterEntity,
  RoleFilterEntity,
  ActionEntity,
  RoleActionEntity,
  ScreenEntity,
  RoleScreenEntity,
  MemberEntity,
  UserGroupEntity,
  UserEntity,
  RoleGroupEntity,
  ActionScreenEntity
} from '..';
import { AclService } from './acl.service';

export class GlobalAcl implements NestInterceptor {
  private logger: Logger;
  protected aclService: AclService;

  // Métodos default
  private methods: string[] = [];

  // Dar push aqui para add mais métodos que não são default
  // O nome do método deve ser exatamente identico ao metodo da service
  // Deve haver uma implementação com o mesmo nome da service
  private otherMethods: string[] = [];

  private exclude: string[] = [];

  constructor(protected SCREEN: string, exclude?: string[]) {
    this.logger = new Logger();
    this.methods = [
      'getManyBase',
      'createManyBase',
      'updateOneBase',
      'createOneBase',
      'deleteOneBase',
      'getOneBase',
      'replaceOneBase',
      'toggleStatus'
    ];
    if (exclude) {
      this.exclude.push(...exclude);
    }
  }

  async start(): Promise<void> {
    const role = getConnection().getRepository(RoleEntity);
    const filter = getConnection().getRepository(FilterEntity);
    const roleFilter = getConnection().getRepository(RoleFilterEntity);
    const action = getConnection().getRepository(ActionEntity);
    const roleAction = getConnection().getRepository(RoleActionEntity);
    const screen = getConnection().getRepository(ScreenEntity);
    const roleScreen = getConnection().getRepository(RoleScreenEntity);
    const member = getConnection().getRepository(MemberEntity);
    const userGroup = getConnection().getRepository(UserGroupEntity);
    const user = getConnection().getRepository(UserEntity);
    const roleGroup = getConnection().getRepository(RoleGroupEntity);
    const actionScreen = getConnection().getRepository(ActionScreenEntity);
    this.aclService = new AclService(
      role,
      filter,
      roleFilter,
      action,
      roleAction,
      screen,
      roleScreen,
      member,
      userGroup,
      user,
      roleGroup,
      actionScreen
    );
  }

  setMethods(methods: string[]) {
    this.otherMethods = methods;
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    // Iniciar o servico da ACL
    if (!this.aclService) {
      await this.start();
    }

    // Carregar métodos personalizados
    this.methods.push(...this.otherMethods);

    const req = context.switchToHttp().getRequest();

    const { method, url, user } = req;

    const functionToBePerformed = context.getHandler().name;

    if (
      typeof this[functionToBePerformed] == 'function' &&
      this.methods.includes(functionToBePerformed) &&
      !this.exclude.includes(functionToBePerformed)
    ) {
      return await this[functionToBePerformed](user, req, next);
    }

    return next.handle();
  }

  async getManyBase(user: UserEntity, req: any, next: CallHandler): Promise<Observable<any>> {
    const { canActivate, actions } = await this.aclService.aclData(user, 'ALL', this.SCREEN);

    if (!canActivate) {
      throw new HttpException('Você não tem permissões para acessar o recurso', HttpStatus.FORBIDDEN);
    }

    const actionsRows: ActionEntity[] = actions.filter((a) => a.type == ACTION_TYPE.ROW);
    const actionsGeneral: ActionEntity[] = actions.filter((a) => a.type == ACTION_TYPE.GENERAL);
    const actionsSelect: ActionEntity[] = actions.filter((a) => a.type == ACTION_TYPE.SELECT);

    // Injetar filtros da tela
    await this.processFilter(req, user);

    return next.handle().pipe(
      map(async (valor: any) => {
        if (valor) {
          // if (valor.hasOwnProperty('data')) {
          if (valor.prototype.hasOwnProperty.call('data')) {
            valor['actions'] = {
              select: actionsSelect,
              general: actionsGeneral
            };

            valor.data.forEach((v: any) => {
              v['actions'] = actionsRows;
            });
          } else {
            valor['actions'] = {
              select: actionsSelect,
              general: actionsGeneral
            };
            valor.forEach((v: any) => {
              v['actions'] = actions;
            });
          }

          return valor;
        }
        return;
      }),
      catchError((err) => {
        if (err instanceof HttpException) {
          throw err;
        }
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    );
  }

  async createManyBase(user: UserEntity, req: any, next: CallHandler): Promise<Observable<any>> {
    const { canActivate, actions } = await this.aclService.aclData(user, ACL_ACTION.ADD, this.SCREEN);

    if (!canActivate) {
      throw new HttpException('Você não tem permissões para acessar o recurso', HttpStatus.FORBIDDEN);
    }

    return next.handle().pipe(
      map(async (valor) => {
        return { data: valor, actions };
      }),
      catchError((err) => {
        if (err instanceof HttpException) {
          throw err;
        }
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    );
  }

  async updateOneBase(user: UserEntity, req: any, next: CallHandler): Promise<Observable<any>> {
    const { canActivate, actions } = await this.aclService.aclData(user, ACL_ACTION.EDIT, this.SCREEN);

    if (!canActivate) {
      throw new HttpException('Você não tem permissões para acessar o recurso', HttpStatus.FORBIDDEN);
    }

    return next.handle().pipe(
      map(async (valor) => {
        return { data: valor, actions };
      }),
      catchError((err) => {
        if (err instanceof HttpException) {
          throw err;
        }
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    );
  }

  async createOneBase(user: UserEntity, req: any, next: CallHandler): Promise<Observable<any>> {
    const { canActivate, actions } = await this.aclService.aclData(user, ACL_ACTION.ADD, this.SCREEN);

    if (!canActivate) {
      throw new HttpException('Você não tem permissões para acessar o recurso', HttpStatus.FORBIDDEN);
    }

    return next.handle().pipe(
      map(async (valor) => {
        return { data: valor, actions };
      }),
      catchError((err) => {
        if (err instanceof HttpException) {
          throw err;
        }
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    );
  }

  async deleteOneBase(user: UserEntity, req: any, next: CallHandler): Promise<Observable<any>> {
    const { canActivate, actions } = await this.aclService.aclData(user, ACL_ACTION.DELETE, this.SCREEN);

    if (!canActivate) {
      throw new HttpException('Você não tem permissões para acessar o recurso', HttpStatus.FORBIDDEN);
    }

    return next.handle().pipe(
      map(async (valor) => {
        return { data: valor, actions };
      }),
      catchError((err) => {
        if (err instanceof HttpException) {
          throw err;
        }
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    );
  }

  async deleteManyBase(user: UserEntity, req: any, next: CallHandler): Promise<Observable<any>> {
    const { canActivate, actions } = await this.aclService.aclData(user, ACL_ACTION.DELETE_MANY, this.SCREEN);

    if (!canActivate) {
      throw new HttpException('Você não tem permissões para acessar o recurso', HttpStatus.FORBIDDEN);
    }

    return next.handle().pipe(
      map(async (valor) => {
        return { data: valor, actions };
      }),
      catchError((err) => {
        if (err instanceof HttpException) {
          throw err;
        }
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    );
  }

  async getOneBase(user: UserEntity, req: any, next: CallHandler): Promise<Observable<any>> {
    const { canActivate, actions } = await this.aclService.aclData(user, ACL_ACTION.VIEW, this.SCREEN);

    if (!canActivate) {
      throw new HttpException('Você não tem permissões para acessar o recurso', HttpStatus.FORBIDDEN);
    }

    return next.handle().pipe(
      map(async (valor) => {
        return { data: valor, actions };
      }),
      catchError((err) => {
        if (err instanceof HttpException) {
          throw err;
        }
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    );
  }

  async replaceOneBase(user: UserEntity, req: any, next: CallHandler): Promise<Observable<any>> {
    const { canActivate, actions } = await this.aclService.aclData(user, ACL_ACTION.EDIT, this.SCREEN);

    if (!canActivate) {
      throw new HttpException('Você não tem permissões para acessar o recurso', HttpStatus.FORBIDDEN);
    }

    return next.handle().pipe(
      map(async (valor) => {
        return { data: valor, actions };
      }),
      catchError((err) => {
        if (err instanceof HttpException) {
          throw err;
        }
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    );
  }

  async toggleStatus(user: UserEntity, req: any, next: CallHandler): Promise<Observable<any>> {
    const { canActivate, actions } = await this.aclService.aclData(user, ACL_ACTION.TOGGLE_STATUS, this.SCREEN);

    if (!canActivate) {
      throw new HttpException('Você não tem permissões para acessar o recurso', HttpStatus.FORBIDDEN);
    }

    return next.handle().pipe(
      map(async (valor) => {
        return { data: valor, actions };
      }),
      catchError((err) => {
        if (err instanceof HttpException) {
          throw err;
        }
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    );
  }

  async deleteMany(user: UserEntity, req: any, next: CallHandler): Promise<Observable<any>> {
    const { canActivate, actions } = await this.aclService.aclData(user, ACL_ACTION.DELETE_MANY, this.SCREEN);

    if (!canActivate) {
      throw new HttpException('Você não tem permissões para acessar o recurso', HttpStatus.FORBIDDEN);
    }

    return next.handle().pipe(
      map(async (valor) => {
        return { data: valor, actions };
      }),
      catchError((err) => {
        if (err instanceof HttpException) {
          throw err;
        }
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    );
  }

  private async processFilter(req: any, user: UserEntity) {
    const filters = await createQueryBuilder(FilterEntity, 'filter')
      .leftJoin('filter.screen', 'screen')
      .leftJoin('filter.roleFilters', 'roleFilters')
      .leftJoin('roleFilters.role', 'role')
      .leftJoin('role.roleGroups', 'roleGroups')
      .leftJoin('roleGroups.group', 'group')
      .leftJoin('group.members', 'members')
      .leftJoin('members.user', 'user')
      .where('user.id = :userId AND screen.key = :screenKey', { userId: user.id, screenKey: this.SCREEN })
      .getMany();

    if (!req.query.filter) {
      if (!filters.length) {
        return req.query['filter'];
      }

      if (!req.query.filter) {
        if (filters.length == 0) {
          return req.query['filter'];
        }

        if (filters.length == 1) {
          if (!filters[0].value) {
            // Se não tiver um valor: data $isnull
            return (req.query['filter'] = `${filters[0].fieldName}||${filters[0].operation}`);
          } else {
            // se tiver um value: status $eq true
            return (req.query['filter'] = `${filters[0].fieldName}||${filters[0].operation}||${filters[0].value}`);
          }
        }

        if (filters.length > 1) {
          req.query.filter = [];
          filters.forEach((filter) => {
            if (!filter.value) {
              // Se não tiver um valor: data $isnull
              return req.query['filter'].push(`${filter.fieldName}||${filter.operation}`);
            } else {
              // se tiver um value: status $eq true
              return req.query['filter'].push(`${filter.fieldName}||${filter.operation}||${filter.value}`);
            }
          });
          return req.query['filter'];
        }
      }
    } else {
      if (!filters.length) {
        return req.query['filter'];
      }

      if (Array.isArray(req.query.filter)) {
        filters.forEach((filter) => {
          if (!filter.value) {
            // Se não tiver um valor: data $isnull
            return req.query['filter'].push(`${filter.fieldName}||${filter.operation}`);
          } else {
            // se tiver um value: status $eq true
            return req.query['filter'].push(`${filter.fieldName}||${filter.operation}||${filter.value}`);
          }
        });
        return req.query['filter'];
      }

      if (typeof req.query.filter == 'string') {
        const temp = req.query['filter'];
        req.query['filter'] = [];
        req.query['filter'].push(temp);

        filters.forEach((filter) => {
          if (!filter.value) {
            // Se não tiver um valor: data $isnull
            return req.query['filter'].push(`${filter.fieldName}||${filter.operation}`);
          } else {
            // se tiver um value: status $eq true
            return req.query['filter'].push(`${filter.fieldName}||${filter.operation}||${filter.value}`);
          }
        });
        return req.query['filter'];
      }
    }

    return req.query['filter'];
  }
}

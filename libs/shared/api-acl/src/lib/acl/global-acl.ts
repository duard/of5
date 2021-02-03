import { CallHandler, ExecutionContext, HttpException, HttpStatus, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ActionScreen } from 'src/entities/action-screen.entity';
import { Action } from 'src/entities/action.entity';
import { Filter } from 'src/entities/filter.entity';
import { Member } from 'src/entities/member.entity';
import { RoleAction } from 'src/entities/role-action.entity';
import { RoleFilter } from 'src/entities/role-filter.entity';
import { RoleScreen } from 'src/entities/role-screen.entity';
import { Role } from 'src/entities/role.entity';
import { RoleGroup } from 'src/entities/roule-group.entity';
import { Screen } from 'src/entities/screen.entity';
import { UserGroup } from 'src/entities/user-group.entity';
import { User } from 'src/entities/user.entity';
import { ACTION_TYPE } from 'src/enums/acl/action-type.enum';
import { ACL_ACTION } from 'src/enums/acl/action.enum';
import { AclService } from 'src/modules/acl/acl.service';
import { createQueryBuilder, getConnection } from 'typeorm';

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
    const role = getConnection().getRepository(Role);
    const filter = getConnection().getRepository(Filter);
    const roleFilter = getConnection().getRepository(RoleFilter);
    const action = getConnection().getRepository(Action);
    const roleAction = getConnection().getRepository(RoleAction);
    const screen = getConnection().getRepository(Screen);
    const roleScreen = getConnection().getRepository(RoleScreen);
    const member = getConnection().getRepository(Member);
    const userGroup = getConnection().getRepository(UserGroup);
    const user = getConnection().getRepository(User);
    const roleGroup = getConnection().getRepository(RoleGroup);
    const actionScreen = getConnection().getRepository(ActionScreen);
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

  async getManyBase(user: User, req: any, next: CallHandler): Promise<Observable<any>> {
    const { canActivate, actions } = await this.aclService.aclData(user, 'ALL', this.SCREEN);

    if (!canActivate) {
      throw new HttpException('Você não tem permissões para acessar o recurso', HttpStatus.FORBIDDEN);
    }

    const actionsRows: Action[] = actions.filter((a) => a.type == ACTION_TYPE.ROW);
    const actionsGeneral: Action[] = actions.filter((a) => a.type == ACTION_TYPE.GENERAL);
    const actionsSelect: Action[] = actions.filter((a) => a.type == ACTION_TYPE.SELECT);

    // Injetar filtros da tela
    await this.processFilter(req, user);

    return next.handle().pipe(
      map(async (valor: any) => {
        if (valor) {
          if (valor.hasOwnProperty('data')) {
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

  async createManyBase(user: User, req: any, next: CallHandler): Promise<Observable<any>> {
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

  async updateOneBase(user: User, req: any, next: CallHandler): Promise<Observable<any>> {
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

  async createOneBase(user: User, req: any, next: CallHandler): Promise<Observable<any>> {
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

  async deleteOneBase(user: User, req: any, next: CallHandler): Promise<Observable<any>> {
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

  async deleteManyBase(user: User, req: any, next: CallHandler): Promise<Observable<any>> {
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

  async getOneBase(user: User, req: any, next: CallHandler): Promise<Observable<any>> {
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

  async replaceOneBase(user: User, req: any, next: CallHandler): Promise<Observable<any>> {
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

  async toggleStatus(user: User, req: any, next: CallHandler): Promise<Observable<any>> {
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

  async deleteMany(user: User, req: any, next: CallHandler): Promise<Observable<any>> {
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

  private async processFilter(req: any, user: User) {
    const filters = await createQueryBuilder(Filter, 'filter')
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

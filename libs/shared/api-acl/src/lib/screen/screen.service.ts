import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getSchemaPath } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { IsArray } from 'class-validator';
import { QueryResolver } from 'nestjs-i18n';
import { ActionsOfScreenDTO, CreateScreenDTO, UpdateScreenDTO } from 'src/dtos/screen.dto';
import { ActionScreen } from 'src/entities/action-screen.entity';
import { Action } from 'src/entities/action.entity';
import { Screen } from 'src/entities/screen.entity';
import { User } from 'src/entities/user.entity';
import { SCREEN_TYPE } from 'src/enums/acl/screen-type.enum';
import { ACL_SCREEN } from 'src/enums/acl/screen.enum';
import { Connection, createQueryBuilder, EntitySchema, Equal, getRepository, Repository } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { ErrorService } from '../error/error.service';

@Injectable()
export class ScreenService extends TypeOrmCrudService<Screen> {
  constructor(private connection: Connection, @InjectRepository(Screen) protected repo: Repository<Screen>) {
    super(repo);
  }

  async create(dto: CreateScreenDTO) {
    const qr = this.connection.createQueryRunner();
    try {
      await qr.connect();
      await qr.startTransaction();

      const alreadyExistKey = await qr.manager.getRepository(Screen).findOne({ where: { key: Equal(dto.key) } });

      if (alreadyExistKey) {
        throw new HttpException('Key já está cadastrada!', HttpStatus.BAD_REQUEST);
      }

      if (dto.type == SCREEN_TYPE.SUBHEADING) {
        const sub = new Screen();
        sub.label = dto.label;
        sub.type = dto.type;
        sub.key = dto.key;

        const savedSub = await qr.manager.getRepository(Screen).save(sub);

        await qr.commitTransaction();

        return savedSub;
      }

      if (dto.type == SCREEN_TYPE.DROPDOWN) {
        const dropdown = new Screen();

        if (dto.parentId) {
          const parent = await qr.manager.getRepository(Screen).findOne(dto.parentId);

          if (!parent) {
            throw new HttpException('Parent não existe', HttpStatus.NOT_FOUND);
          }
          dropdown.parent = parent;
        }

        dropdown.label = dto.label;
        dropdown.icon = dto.icon;
        dropdown.type = dto.type;
        dropdown.key = dto.key;

        const savedDropdown = await qr.manager.getRepository(Screen).save(dropdown);

        await qr.commitTransaction();

        return savedDropdown;
      }

      if (dto.type == SCREEN_TYPE.LINK) {
        const link = new Screen();

        if (!dto.route) {
          throw new HttpException('Informe uma url para o menu', HttpStatus.BAD_REQUEST);
        }

        if (!dto.actions) {
          throw new HttpException('Informe ao menos uma ação para a tela', HttpStatus.BAD_REQUEST);
        }

        if (dto.parentId) {
          const parent = await qr.manager.getRepository(Screen).findOne(dto.parentId);

          if (!parent) {
            throw new HttpException('Parent não existe', HttpStatus.NOT_FOUND);
          }
          link.parent = parent;
        }

        link.label = dto.label;
        link.icon = dto.icon;
        link.type = dto.type;
        link.key = dto.key;
        link.route = dto.route;

        const savedLink = await qr.manager.getRepository(Screen).save(link);

        const actions = await qr.manager.getRepository(Action).findByIds(dto.actions);

        const actionsScreen: ActionScreen[] = [];

        actions.forEach((action) => {
          actionsScreen.push(new ActionScreen(savedLink, action));
        });

        await qr.manager.getRepository(ActionScreen).save(actionsScreen);

        await qr.commitTransaction();

        return savedLink;
      }

      throw new HttpException('Informe um tipo de menu válido', HttpStatus.BAD_REQUEST);
    } catch (err) {
      await ErrorService.next(err, qr);
    } finally {
      await qr.release();
    }
  }

  async update(id: number, dto: UpdateScreenDTO) {
    const qr = this.connection.createQueryRunner();
    try {
      await qr.connect();
      await qr.startTransaction();

      const screenTransaction = qr.manager.getRepository(Screen);

      const exists = await screenTransaction.findOne(id);

      if (!exists) {
        throw new HttpException('Screen não existe', HttpStatus.NOT_FOUND);
      }

      if (exists.type == SCREEN_TYPE.SUBHEADING) {
        delete dto.actions;
        delete dto.icon;
        delete dto.parentId;
        delete dto.route;

        const sub = this.repo.create(dto);

        await screenTransaction.update(id, sub);

        await qr.commitTransaction();

        return this.repo.findOne(id);
      }

      if (exists.type == SCREEN_TYPE.DROPDOWN) {
        delete dto.actions;
        delete dto.route;

        const drop = this.repo.create(dto);

        if (dto.parentId) {
          const parent = await screenTransaction.findOne(dto.parentId);

          if (!parent) {
            throw new HttpException('Parent não existe', HttpStatus.NOT_FOUND);
          }
          drop.parent = parent;
        }

        await screenTransaction.update(id, drop);

        await qr.commitTransaction();

        return this.repo.findOne(id);
      }

      if (exists.type == SCREEN_TYPE.LINK) {
        const link = this.repo.create(dto);

        if (dto.parentId) {
          const parent = await screenTransaction.findOne(dto.parentId);

          if (!parent) {
            throw new HttpException('Parent não existe', HttpStatus.NOT_FOUND);
          }
          link.parent = parent;
        }

        await screenTransaction.update(id, link);

        if (dto.actions) {
          await qr.manager
            .getRepository(ActionScreen)
            .createQueryBuilder('as')
            .leftJoinAndSelect('as.screen', 'screen')
            .delete()
            .where('screen.screenId = :id', { id })
            .execute();

          const actions = await qr.manager.getRepository(Action).findByIds(dto.actions);

          const actionsScreen: ActionScreen[] = [];

          actions.forEach((action) => {
            actionsScreen.push(new ActionScreen(exists, action));
          });

          await qr.manager.getRepository(ActionScreen).save(actionsScreen);
        }

        await qr.commitTransaction();

        return this.repo.findOne(id);
      }
    } catch (err) {
      await ErrorService.next(err, qr);
    } finally {
      await qr.release();
    }
  }

  async actionsOfScreen(dto: ActionsOfScreenDTO) {
    if (!dto.screens) {
      throw new HttpException('Informe uma tela válida', HttpStatus.BAD_REQUEST);
    }

    if (!Array.isArray(dto.screens)) {
      const exists = await this.repo.findOne(dto.screens);

      if (!exists) {
        throw new HttpException('Screen não existe', HttpStatus.NOT_FOUND);
      }

      const actions = await createQueryBuilder(Action, 'action')
        .leftJoinAndSelect('action.actionsScreen', 'actionsScreen')
        .leftJoinAndSelect('actionsScreen.screen', 'screen')
        .where('screen.screenId in (:screenIds)', { screenIds: dto.screens })
        .getMany();

      actions.forEach((a) => delete a.actionsScreen);

      return actions;
    } else {
      const screens = await this.repo.findByIds(dto.screens);

      if (screens.length <= 0) {
        throw new HttpException('Screens não existem', HttpStatus.NOT_FOUND);
      }

      let clause = '';
      const params = {};

      dto.screens.forEach((s, index) => {
        const hasNext = dto.screens[index + 1];

        if (hasNext) {
          clause += `screen.screenId = :screen${index} OR `;
          params[`screen${index}`] = s;
        } else {
          clause += `screen.screenId = :screen${index} `;
          params[`screen${index}`] = s;
        }
      });

      clause = `(${clause})`;

      const actions = await createQueryBuilder(Action, 'action')
        .leftJoinAndSelect('action.actionsScreen', 'actionsScreen')
        .leftJoinAndSelect('actionsScreen.screen', 'screen')
        .where(clause, params)
        .getMany();

      actions.forEach((a) => delete a.actionsScreen);

      return actions;
    }
  }

  async getFields(key: string) {
    const fields: string[] = [];

    const screens: [string, string][] = Object.entries(ACL_SCREEN);

    let screen = '';

    screens.forEach((s) => {
      if (s[1] == key) {
        screen = s[0];
      }
    });

    if (!screen) {
      throw new HttpException('Screen não encontrada', HttpStatus.NOT_FOUND);
    }

    if (screen == 'Absence') {
      getRepository(screen).metadata.columns.forEach((meta) =>
        meta.propertyName && meta.propertyName != 'nsleft' && meta.propertyName != 'nsright'
          ? fields.push(meta.propertyName)
          : false
      );
      return fields;
    }

    getRepository(screen).metadata.columns.forEach((meta) => fields.push(meta.propertyName));

    return fields;
  }
}

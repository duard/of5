import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ErrorService, EXCEPTION } from '@of5/shared/api-shared';
import { Connection, Repository } from 'typeorm';

import { getUserFromRequest } from '../functions';
import { MemberEntity } from '../members/members.entity';
import { UserEntity } from '../users/users.entity';
import { CloneGroupDTO, UserGroupCreateDTO, UserGroupUpdateDTO } from './users-groups.dto';
import { UserGroupEntity } from './users-groups.entity';

@Injectable()
export class UserGroupService extends TypeOrmCrudService<UserGroupEntity> {
  constructor(
    private connection: Connection,
    @InjectRepository(UserGroupEntity)
    private readonly userGroupRepository: Repository<UserGroupEntity>
  ) {
    super(userGroupRepository);
  }

  async saveOne(req: Request, dto: UserGroupCreateDTO): Promise<UserGroupEntity> {
    const user = getUserFromRequest(req);

    const userGroupToSave = this.userGroupRepository.create(dto);
    userGroupToSave.createdBy = user;

    const savedGroup = await this.userGroupRepository.save(userGroupToSave);

    return savedGroup;
  }

  async update(req: Request, id: number, dto: UserGroupUpdateDTO) {
    const user = getUserFromRequest(req);

    const groupToEdit = await this.userGroupRepository.findOne(id);

    if (!groupToEdit) {
      throw new HttpException(EXCEPTION.NOT_FOUND, 400);
    }

    const groupToUpdate = this.userGroupRepository.create(dto);
    groupToUpdate.updatedBy = user;

    await this.userGroupRepository.update(id, groupToUpdate);

    const updatedGroup = await this.userGroupRepository.findOne(id, { relations: ['updatedBy', 'createdBy'] });

    return updatedGroup;
  }

  async cloneGroups(dto: CloneGroupDTO) {
    const qr = this.connection.createQueryRunner();
    try {
      await qr.connect();
      await qr.startTransaction();

      const userToGetGroups = await qr.manager
        .getRepository(UserEntity)
        .findOne(dto.user, { relations: ['members', 'members.group'] });

      if (!userToGetGroups) {
        throw new HttpException('Selecione um usuário para copiar os grupos', HttpStatus.BAD_REQUEST);
      }

      const userToSetGroups = await qr.manager
        .getRepository(UserEntity)
        .findOne(dto.cloneUser, { relations: ['members', 'members.group'] });

      if (!userToSetGroups) {
        throw new HttpException('Selecione um usuário para ser atribuido os grupos', HttpStatus.BAD_REQUEST);
      }

      if (dto.operation) {
        const groups2: UserGroupEntity[] = [];
        const groupsToAdd: UserGroupEntity[] = [];

        userToSetGroups.members.forEach((m) => groups2.push(m.group));

        userToGetGroups.members.forEach((member) => {
          const hasGroup = groups2.filter((g2) => g2.id == member.group.id).length;

          if (!hasGroup) {
            groupsToAdd.push(member.group);
          }
        });

        const members: MemberEntity[] = [];
        delete userToSetGroups.members;
        groupsToAdd.forEach((group) => {
          members.push(new MemberEntity(userToSetGroups, group));
        });

        const saved = await qr.manager.save(members);

        await qr.commitTransaction();

        return;
      } else {
        const groupsToAssign: UserGroupEntity[] = [];

        userToGetGroups.members.forEach((m) => groupsToAssign.push(m.group));

        await qr.manager
          .createQueryBuilder(MemberEntity, 'member')
          .leftJoin('member.user', 'user')
          .delete()
          .where('user.id = :userId', { userId: dto.cloneUser })
          .execute();

        const members: MemberEntity[] = [];

        delete userToSetGroups.members;
        groupsToAssign.forEach((group) => members.push(new MemberEntity(userToSetGroups, group)));

        const saved = await qr.manager.save(members);

        await qr.commitTransaction();

        return;
      }
    } catch (err) {
      await ErrorService.next(err, qr);
    } finally {
      await qr.release();
    }
  }
}

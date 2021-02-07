import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { AUTH, AwsService, ErrorService, EXCEPTION, FOLDER } from '@of5/shared/api-shared';
import { BinaryFile } from '@of5/shared/interfaces';
import * as bcrypt from 'bcrypt';
import { Connection, createQueryBuilder, Repository } from 'typeorm';

import { MemberEntity } from '../members/members.entity';
import { UserGroupEntity } from '../users-groups/users-groups.entity';
import { UserCreateDTO, UserUpdateDTO } from './users.dto';
import { UserEntity } from './users.entity';

@Injectable()
export class UsersService extends TypeOrmCrudService<UserEntity> {
  constructor(
    private connection: Connection,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private awsService: AwsService
  ) {
    super(userRepository);
  }

  async saveOne(user: UserEntity, dto: UserCreateDTO, media: BinaryFile): Promise<UserEntity> {
    const qr = this.connection.createQueryRunner();
    try {
      await qr.connect();
      await qr.startTransaction();

      if (await qr.manager.getRepository(UserEntity).findOne({ where: { email: dto.email } })) {
        throw new HttpException(AUTH.MAIL_EXISTS, 400);
      }

      const userToSave = this.userRepository.create(dto);

      userToSave.password = bcrypt.hashSync(dto.password, 10);
      userToSave.createdBy = user;

      if (media) {
        const uploaded = await this.awsService.uploadToPath(FOLDER.USER, media);
        userToSave.urlPhoto = uploaded.location;
        userToSave.uuid = uploaded.uuid;
      }

      const savedUser = await qr.manager.getRepository(UserEntity).save(userToSave);

      const userGroups = await qr.manager.getRepository(UserGroupEntity).findByIds(dto.groups);

      const members: MemberEntity[] = [];

      userGroups.forEach((group) => members.push(new MemberEntity(savedUser, group)));

      await qr.manager.getRepository(MemberEntity).save(members);

      qr.commitTransaction();

      return await this.userRepository.findOne(savedUser.id);
    } catch (err) {
      await ErrorService.next(err, qr);
    } finally {
      await qr.release();
    }
  }

  async update(user: UserEntity, id: number, dto: UserUpdateDTO, media: BinaryFile): Promise<UserEntity> {
    const qr = this.connection.createQueryRunner();
    try {
      await qr.connect();
      await qr.startTransaction();

      const userAlreadyExists = await qr.manager.getRepository(UserEntity).findOne(id);

      if (!userAlreadyExists) {
        throw new HttpException(EXCEPTION.NOT_FOUND, 400);
      }

      const userToUpdate = this.userRepository.create(dto);

      userToUpdate.updatedBy = user;

      if (media) {
        const uploaded = await this.awsService.uploadToPath(FOLDER.USER, media);
        userToUpdate.urlPhoto = uploaded.location;
        userToUpdate.uuid = uploaded.uuid;
      }

      await qr.manager.getRepository(UserEntity).update(id, userToUpdate);

      const updatedUser = await qr.manager
        .getRepository(UserEntity)
        .findOne(id, { relations: ['updatedBy', 'createdBy'] });
      delete updatedUser.password;

      if (dto.groups.length > 0) {
        const userGroups = await qr.manager.getRepository(UserGroupEntity).findByIds(dto.groups);

        await createQueryBuilder(MemberEntity, 'member')
          .leftJoinAndSelect('member.user', 'user')
          .delete()
          .where('user.id = :userId', { userId: id })
          .execute();

        const members: MemberEntity[] = [];

        userGroups.forEach((group) => members.push(new MemberEntity(userAlreadyExists, group)));

        await qr.manager.getRepository(MemberEntity).save(members);
      }

      await qr.commitTransaction();

      return updatedUser;
    } catch (err) {
      await ErrorService.next(err);
    } finally {
      await qr.release();
    }
  }
}

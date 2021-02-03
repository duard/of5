import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { QueryResolver } from 'nestjs-i18n';
import { UserCreateDTO, UserUpdateDTO } from 'src/dtos/user.dto';
import { Member } from 'src/entities/member.entity';
import { UserGroup } from 'src/entities/user-group.entity';
import { FOLDER } from 'src/enums/folder.enum';
import { AUTH } from 'src/enums/translate/auth.enum';
import { EXCEPTION } from 'src/enums/translate/exception.enum';
import { USER_GROUP } from 'src/enums/translate/user-group.enum';
import { AwsService } from 'src/services/aws/aws.service';
import { BinaryFile } from 'src/shared/interfaces/file.interface';
import { getUserFromRequest } from 'src/shared/utils/functions';
import { Connection, createQueryBuilder, getRepository, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { ErrorService } from '../error/error.service';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    private connection: Connection,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private awsService: AwsService
  ) {
    super(userRepository);
  }

  async saveOne(user: User, dto: UserCreateDTO, media: BinaryFile): Promise<User> {
    const qr = this.connection.createQueryRunner();
    try {
      await qr.connect();
      await qr.startTransaction();

      if (await qr.manager.getRepository(User).findOne({ where: { email: dto.email } })) {
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

      const savedUser = await qr.manager.getRepository(User).save(userToSave);

      const userGroups = await qr.manager.getRepository(UserGroup).findByIds(dto.groups);

      const members: Member[] = [];

      userGroups.forEach((group) => members.push(new Member(savedUser, group)));

      await qr.manager.getRepository(Member).save(members);

      qr.commitTransaction();

      return await this.userRepository.findOne(savedUser.id);
    } catch (err) {
      await ErrorService.next(err, qr);
    } finally {
      await qr.release();
    }
  }

  async update(user: User, id: number, dto: UserUpdateDTO, media: BinaryFile): Promise<User> {
    const qr = this.connection.createQueryRunner();
    try {
      await qr.connect();
      await qr.startTransaction();

      const userAlreadyExists = await qr.manager.getRepository(User).findOne(id);

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

      await qr.manager.getRepository(User).update(id, userToUpdate);

      const updatedUser = await qr.manager.getRepository(User).findOne(id, { relations: ['updatedBy', 'createdBy'] });
      delete updatedUser.password;

      if (dto.groups.length > 0) {
        const userGroups = await qr.manager.getRepository(UserGroup).findByIds(dto.groups);

        await createQueryBuilder(Member, 'member')
          .leftJoinAndSelect('member.user', 'user')
          .delete()
          .where('user.id = :userId', { userId: id })
          .execute();

        const members: Member[] = [];

        userGroups.forEach((group) => members.push(new Member(userAlreadyExists, group)));

        await qr.manager.getRepository(Member).save(members);
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

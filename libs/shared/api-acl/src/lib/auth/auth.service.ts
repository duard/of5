import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AUTH, AwsService, ErrorService, EXCEPTION, FOLDER } from '@of5/shared/api-shared';
import { BinaryFile } from '@of5/shared/interfaces';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { createQueryBuilder, getConnection, getRepository, QueryRunner } from 'typeorm';

import { MemberEntity, UserEntity, UserGroupEntity } from '..';
import { AuthSignInDto, AuthSignUpDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private awsService: AwsService) {}

  async signUp(authDto: AuthSignUpDto, media: BinaryFile) {
    const queryRunner: QueryRunner = getConnection().createQueryRunner();
    try {
      queryRunner.connect();
      queryRunner.startTransaction();

      const { email, password } = authDto;

      const isExist = await queryRunner.manager.getRepository(UserEntity).findOne({
        where: { email }
      });

      if (isExist) {
        throw new HttpException(AUTH.MAIL_EXISTS, 400);
      }

      const user = getRepository(UserEntity).create(authDto);

      user.password = await bcrypt.hash(password.toString(), 10);

      if (media) {
        const uploaded = await this.awsService.uploadToPath(FOLDER.USER, media);
        user.urlPhoto = uploaded.location;
        user.uuid = uploaded.uuid;
      }

      const savedUser = await queryRunner.manager.getRepository(UserEntity).save(user);

      await queryRunner.manager.getRepository(UserEntity).update(savedUser.id, { createdBy: savedUser });

      const updatedUser = await queryRunner.manager.getRepository(UserEntity).findOne(savedUser.id);
      delete updatedUser.password;

      if (authDto.groups) {
        const userGroups = await getRepository(UserGroupEntity).findByIds(authDto.groups);

        const members: MemberEntity[] = [];

        userGroups.forEach((group) => members.push(new MemberEntity(user, group)));

        await queryRunner.manager.save(MemberEntity, members);
      }

      await queryRunner.commitTransaction();

      return updatedUser;
    } catch (err) {
      await ErrorService.next(err, queryRunner);
    } finally {
      if (queryRunner) {
        await queryRunner.release();
      }
    }
  }

  async signIn(req: Request, authDto: AuthSignInDto) {
    const user: UserEntity = await this.validateUserAndPassword(authDto);

    if (!user) {
      throw new HttpException(AUTH.INVALID_CREDENTIALS, 401);
    }

    const token = this.jwtService.sign({ ...user });

    return { user, token };
  }

  async validateUserAndPassword(authDto: AuthSignInDto) {
    const { email, password } = authDto;

    const user = await createQueryBuilder(UserEntity, 'user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new HttpException(AUTH.INVALID_CREDENTIALS, 401);
    }

    const isSamePassword = await bcrypt.compare(password, user.password);

    if (isSamePassword) {
      delete user.password;
      return user;
    }
    return null;
  }

  async googleLogin(req: Request) {
    if (!req.user) {
      throw new UnauthorizedException(EXCEPTION.UNAUTHORIZED);
    }

    const userExists = await getRepository(UserEntity).findOne({ where: { email: req.user['email'] } });
    if (!userExists) {
      return {
        exists: false,
        ...req.user
      };
    }
    delete userExists.password;
    const token = this.jwtService.sign({ ...userExists });

    return { token, exists: true };
  }

  async facebookLogin(req: Request) {
    if (!req.user) {
      throw new UnauthorizedException(EXCEPTION.UNAUTHORIZED);
    }

    const userExists = await getRepository(UserEntity).findOne({ where: { email: req.user['email'] } });
    if (!userExists) {
      return {
        exists: false,
        ...req.user
      };
    }
    delete userExists.password;
    const token = this.jwtService.sign({ ...userExists });

    return { token, exists: true };
  }

  async linkedinLogin(req: any) {
    if (!req.user) {
      throw new HttpException(EXCEPTION.UNAUTHORIZED, 401);
    }
    return { ...req.user };
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from '@of5/shared/api-shared';

import { AuthModule } from '../auth/auth.module';
import { UserEntity } from './users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule, AwsModule],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}

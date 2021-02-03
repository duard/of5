import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from 'src/services/aws/aws.module';
import { User } from '../../entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, AwsModule],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}

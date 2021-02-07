import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParameterEntity } from '..';
import { ParameterController } from './parameters.controller';
import { ParameterService } from './parameters.service';
import { UnauthParameterController } from './unauth-parameters.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ParameterEntity])],
  providers: [ParameterService],
  controllers: [ParameterController, UnauthParameterController]
})
export class ParameterModule {}

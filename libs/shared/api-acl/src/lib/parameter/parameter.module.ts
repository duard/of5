import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParameterController } from './parameter.controller';
import { ParameterEntity } from './parameter.entity';
import { ParameterService } from './parameter.service';
import { UnauthParameterController } from './unauth-parameter.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ParameterEntity])],
  providers: [ParameterService],
  controllers: [ParameterController, UnauthParameterController]
})
export class ParameterModule {}

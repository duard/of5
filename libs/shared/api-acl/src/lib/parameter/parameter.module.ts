import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parameter } from 'src/entities/parameter.entity';
import { ParameterController } from './parameter.controller';
import { ParameterService } from './parameter.service';
import { UnauthParameterController } from './unauth-parameter.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Parameter])],
  providers: [ParameterService],
  controllers: [ParameterController, UnauthParameterController]
})
export class ParameterModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActionEntity } from '..';
import { ActionController } from './actions.controller';
import { ActionService } from './actions.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActionEntity])],
  controllers: [ActionController],
  providers: [ActionService],
  exports: [ActionService]
})
export class ActionModule {}

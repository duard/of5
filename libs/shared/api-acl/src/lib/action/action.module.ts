import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActionController } from './action.controller';
import { ActionEntity } from './action.entity';
import { ActionService } from './action.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActionEntity])],
  controllers: [ActionController],
  providers: [ActionService],
  exports: [ActionService]
})
export class ActionModule {}

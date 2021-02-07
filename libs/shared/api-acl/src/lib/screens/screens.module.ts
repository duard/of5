import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScreenEntity } from '..';
import { ScreenController } from './screens.controller';
import { ScreenService } from './screens.service';

@Module({
  imports: [TypeOrmModule.forFeature([ScreenEntity])],
  controllers: [ScreenController],
  providers: [ScreenService],
  exports: [ScreenService]
})
export class ScreenModule {}

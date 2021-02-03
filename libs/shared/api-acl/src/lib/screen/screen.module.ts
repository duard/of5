import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScreenController } from './screen.controller';
import { ScreenEntity } from './screen.entity';
import { ScreenService } from './screen.service';

@Module({
  imports: [TypeOrmModule.forFeature([ScreenEntity])],
  controllers: [ScreenController],
  providers: [ScreenService],
  exports: [ScreenService]
})
export class ScreenModule {}

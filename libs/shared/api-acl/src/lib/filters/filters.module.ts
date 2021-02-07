import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilterEntity } from '..';
import { FilterController } from './filters.controller';
import { FilterService } from './filters.service';

@Module({
  imports: [TypeOrmModule.forFeature([FilterEntity])],
  controllers: [FilterController],
  providers: [FilterService],
  exports: [FilterService]
})
export class FilterModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilterController } from './filter.controller';
import { FilterEntity } from './filter.entity';
import { FilterService } from './filter.service';

@Module({
  imports: [TypeOrmModule.forFeature([FilterEntity])],
  controllers: [FilterController],
  providers: [FilterService],
  exports: [FilterService]
})
export class FilterModule {}

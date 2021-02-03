import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Filter } from 'src/entities/filter.entity';
import { FilterController } from './filter.controller';
import { FilterService } from './filter.service';

@Module({
  imports: [TypeOrmModule.forFeature([Filter])],
  controllers: [FilterController],
  providers: [FilterService],
  exports: [FilterService]
})
export class FilterModule {}

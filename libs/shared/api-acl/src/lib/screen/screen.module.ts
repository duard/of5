import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Screen } from 'src/entities/screen.entity';
import { ScreenController } from './screen.controller';
import { ScreenService } from './screen.service';

@Module({
  imports: [TypeOrmModule.forFeature([Screen])],
  controllers: [ScreenController],
  providers: [ScreenService],
  exports: [ScreenService]
})
export class ScreenModule {}

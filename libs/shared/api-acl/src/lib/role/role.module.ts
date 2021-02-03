import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from 'src/entities/action.entity';
import { Role } from 'src/entities/role.entity';
import { Screen } from 'src/entities/screen.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
@Module({
  imports: [TypeOrmModule.forFeature([Role, Screen, Action])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService]
})
export class RoleModule {}

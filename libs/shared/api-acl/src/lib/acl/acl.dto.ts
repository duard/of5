import { ApiProperty } from '@nestjs/swagger';
import { DTO } from '@of5/shared/api-shared';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { FilterScreen } from './filter-screen.model';

export class AssociateFiltersWithRoleDTO {
  @IsNotEmpty({ message: 'Role é obrigatório' })
  @ApiProperty({ required: true })
  role: number;

  @IsNotEmpty({ message: 'Filtros são obrigatórios' })
  @IsArray({ message: 'Os filtros devem ser uma lista' })
  @ApiProperty({ required: true })
  filters: number[];
}

export class AssociateActionsWithRoleDTO {
  @IsNotEmpty({ message: 'Role é obrigatório' })
  @ApiProperty({ required: true })
  role: number;

  @IsNotEmpty({ message: 'Actions são obrigatórios' })
  @IsArray({ message: 'As ações devem ser uma lista' })
  @ApiProperty({ required: true })
  actions: number[];
}

export class AssociateScreensWithRoleDTO {
  @IsNotEmpty({ message: 'Role é obrigatório' })
  @ApiProperty({ required: true })
  role: number;

  @IsNotEmpty({ message: 'Screens são obrigatórias' })
  @IsArray({ message: 'As telas devem ser uma lista' })
  @ApiProperty({ required: true })
  screens: number[];
}

export class AssociateUserWithGroupsDTO {
  @IsOptional()
  @ApiProperty({ required: false })
  user: number;

  @IsNotEmpty({ message: 'Groups são obrigatórios' })
  @IsArray({ message: 'Os grupos devem ser uma lista' })
  @ApiProperty({ required: true })
  groups: number[];
}

export class AssociateGroupWithUsersDTO {
  @IsNotEmpty({ message: 'Grupo é obrigatório' })
  @ApiProperty({ required: true })
  group: number;

  @IsNotEmpty({ message: 'Usuários são obrigatórios' })
  @IsArray({ message: 'Os usuários devem ser uma lista' })
  @ApiProperty({ required: true })
  users: number[];
}

export class AssociateGroupWithRolesDTO {
  @IsNotEmpty({ message: 'Grupo é obrigatório' })
  @ApiProperty({ required: true })
  group: number;

  @IsNotEmpty({ message: 'Roles são obrigatórios' })
  @IsArray({ message: 'Os papéis devem ser uma lista' })
  @ApiProperty({ required: true })
  roles: number[];
}

export class CanAccessDTO {
  @IsNotEmpty({ message: 'screen não pode ser vazia' })
  @ApiProperty({ required: true })
  screen: string;
}

export class AssociateScreenWithActionsDTO {
  @IsNotEmpty({ message: 'Screen é obrigatório' })
  @ApiProperty({ required: true })
  screen: number;

  @IsNotEmpty({ message: 'Actions são obrigatórios' })
  @IsArray({ message: 'As actions devem ser uma lista' })
  @ApiProperty({ required: true })
  actions: number[];
}

export class SetFiltersDTO {
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  @IsArray()
  @ApiProperty({
    required: true,
    example: [{ screen: 0, filters: [{ field: 'string', op: 'string', value: 'string' }] }]
  })
  screens: FilterScreen[];
}

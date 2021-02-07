import { ApiProperty } from '@nestjs/swagger';
import { SCREEN_TYPE } from '@of5/shared/api-shared';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateScreenDTO {
  @IsNotEmpty({ message: 'Informe um nome' })
  @ApiProperty({ required: true })
  label: string;

  @IsNotEmpty({ message: 'Informe um tipo válido' })
  @ApiProperty({ required: true })
  @IsEnum(SCREEN_TYPE)
  type: string;

  @IsNotEmpty({ message: 'Informe uma key válida' })
  @ApiProperty({ required: true })
  key: string;

  @IsOptional()
  @ApiProperty({ required: false })
  route: string;

  @IsOptional()
  @ApiProperty({ required: false })
  icon: string;

  @IsOptional()
  @ApiProperty({ required: false })
  parentId: number;

  @IsOptional()
  @ApiProperty({ required: false })
  actions: number[];
}

export class UpdateScreenDTO {
  @IsNotEmpty({ message: 'Informe um nome' })
  @ApiProperty({ required: true })
  label: string;

  @IsNotEmpty({ message: 'Informe um tipo válido' })
  @ApiProperty({ required: true })
  type: string;

  @IsOptional()
  @ApiProperty({ required: false })
  route: string;

  @IsOptional()
  @ApiProperty({ required: false })
  icon: string;

  @IsOptional()
  @ApiProperty({ required: false })
  parentId: number;

  @IsOptional()
  @ApiProperty({ required: false })
  actions: number[];
}

export class ActionsOfScreenDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  screens: number[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoleDTO {
  @IsNotEmpty({ message: 'Informe um nome' })
  @ApiProperty({ required: true })
  name: string;

  @IsNotEmpty({ message: 'Informe ao menos uma Screen' })
  @IsArray()
  @ApiProperty({ required: true })
  screens: number[];

  @IsNotEmpty({ message: 'Informe ao menos uma Action' })
  @IsArray()
  @ApiProperty({ required: true })
  actions: number[];
}

export class UpdateRoleDTO {
  @IsOptional()
  @ApiProperty({ required: false })
  name: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ required: false })
  screens: number[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ required: false })
  actions: number[];
}

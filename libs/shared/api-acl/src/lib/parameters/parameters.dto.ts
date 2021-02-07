import { ApiProperty } from '@nestjs/swagger';
import { DTO } from '@of5/shared/api-shared';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateParameterDTO {
  @ApiProperty({
    nullable: false,
    maxLength: 250,
    description: 'Descrição do parametro'
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  description: string;

  @ApiProperty({
    nullable: true,
    maxLength: 255,
    description: 'Valor do parametro'
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  value: string;

  @ApiProperty({
    nullable: false,
    maxLength: 250,
    description: 'Chave do parametro'
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  key: string;
}

export class UpdateParameterDTO {
  @ApiProperty({
    nullable: false,
    maxLength: 250,
    description: 'Descrição do parametro',
    required: false
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  description: string;

  @ApiProperty({
    nullable: false,
    maxLength: 250,
    description: 'Valor do parametro',
    required: false
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  value: string;

  @ApiProperty({
    nullable: false,
    maxLength: 250,
    description: 'Chave do parametro',
    required: false
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  key: string;
}

export class UpdateParameterByKeyDTO {
  @ApiProperty({
    nullable: true,
    maxLength: 255,
    description: 'Valor do parâmetro',
    required: false
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  value: string;
}

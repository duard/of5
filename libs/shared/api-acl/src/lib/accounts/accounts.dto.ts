import { ApiProperty } from '@nestjs/swagger';
import { DTO } from '@of5/shared/api-shared';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateAccountDTO {
  @ApiProperty({
    description: 'Descrição da conta',
    nullable: false,
    required: true
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  description: string;

  @ApiProperty({
    description: 'URL da conta',
    nullable: false,
    required: true
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  url: string;

  @ApiProperty({
    description: 'Token da conta',
    nullable: false,
    required: true
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  token: string;

  @ApiProperty({
    description: 'Nome de usuário da conta',
    nullable: false,
    required: true
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  user: string;

  @ApiProperty({
    description: 'Senha da conta',
    nullable: false,
    required: true
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  password: string;
}

export class UpdateAccountDTO {
  @ApiProperty({
    description: 'Descrição da conta',
    nullable: false,
    required: false
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  description: string;

  @ApiProperty({
    description: 'URL da conta',
    nullable: false,
    required: false
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  url: string;

  @ApiProperty({
    description: 'Token da conta',
    nullable: false,
    required: false
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  token: string;

  @ApiProperty({
    description: 'Nome de usuário da conta',
    nullable: false,
    required: false
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  user: string;

  @ApiProperty({
    description: 'Senha da conta',
    nullable: false,
    required: false
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  password: string;
}

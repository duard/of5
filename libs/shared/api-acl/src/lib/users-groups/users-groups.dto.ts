import { ApiProperty } from '@nestjs/swagger';
import { DTO } from '@of5/shared/api-shared';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class UserGroupCreateDTO {
  @ApiProperty({
    description: 'Nome do grupo',
    nullable: false
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  description: string;

  @ApiProperty({
    description: 'Cor do grupo',
    nullable: false
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  colorGroup: string;

  @ApiProperty({
    description: 'Expiração da senha',
    nullable: false
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  passExpiration: Date;

  @ApiProperty({
    description: 'Trocar senha do usuário',
    type: 'boolean',
    nullable: false
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  passChange: boolean;

  @ApiProperty({
    description: 'Dias para trocar a senha',
    type: 'integer',
    nullable: false
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  passDaysChange: number;

  @ApiProperty({
    description: 'Timeout em minutos',
    type: 'integer',
    nullable: false
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  timeout: number;

  @ApiProperty({
    description: 'Utiliza MDI',
    type: 'boolean',
    nullable: false
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  mdi: boolean;

  @ApiProperty({
    description: 'Número máximo de janelas MDI',
    type: 'integer',
    nullable: false
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  mdiMax: number;
}

export class UserGroupUpdateDTO {
  @ApiProperty({
    description: 'Nome do grupo',
    nullable: false
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  description: string;

  @ApiProperty({
    description: 'Cor do grupo',
    nullable: false
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  colorGroup: string;

  @ApiProperty({
    description: 'Expiração da senha',
    nullable: false
  })
  @IsOptional()
  passExpiration: Date;

  @ApiProperty({
    description: 'Trocar senha do usuário',
    type: 'boolean',
    nullable: false
  })
  @IsOptional()
  passChange: boolean;

  @ApiProperty({
    description: 'Dias para trocar a senha',
    type: 'integer',
    nullable: false
  })
  @IsOptional()
  passDaysChange: number;

  @ApiProperty({
    description: 'Timeout em minutos',
    type: 'integer',
    nullable: false
  })
  @IsOptional()
  timeout: number;

  @ApiProperty({
    description: 'Utiliza MDI',
    type: 'boolean',
    nullable: false
  })
  @IsOptional()
  mdi: boolean;

  @ApiProperty({
    description: 'Número máximo de janelas MDI',
    type: 'integer',
    nullable: false
  })
  @IsOptional()
  mdiMax: number;
}

export class CloneGroupDTO {
  @ApiProperty({
    description: `Operação: true = mescla permissões,
        false =  define as permissões exatamente iguais a
        do usuário desconsiderando se o usuário já tenha alguma permissão`,
    required: true
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  operation: boolean;

  @ApiProperty({
    description: 'Identificação do usuário que receberá os grupos',
    type: 'integer',
    nullable: false
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  user: number;

  @ApiProperty({
    description: 'Identificação do usuário que já tem os grupos',
    type: 'integer',
    nullable: false
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  cloneUser: number;
}

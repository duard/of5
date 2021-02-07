import { ApiProperty } from '@nestjs/swagger';
import { DTO } from '@of5/shared/api-shared';
import { IsEmail, IsNotEmpty, IsOptional, Length, MaxLength } from 'class-validator';

export class UserCreateDTO {
  @ApiProperty({
    description: 'Nome de usuário',
    type: 'string',
    nullable: false,
    minLength: 2,
    maxLength: 200
  })
  @IsOptional()
  @Length(2, 200, { message: DTO.LENGTH_2_200 })
  username: string;

  @ApiProperty({
    description: 'Email do usuário',
    type: 'string',
    nullable: false
  })
  @IsOptional()
  @IsEmail({}, { message: DTO.IS_EMAIL })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    type: 'string',
    nullable: false
  })
  @MaxLength(100, { message: DTO.MAX_LENGTH_100 })
  @IsOptional()
  password: string;

  @ApiProperty({
    description: 'Facebook do usuário',
    type: 'string',
    nullable: true,
    maxLength: 250
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  facebook: string;

  @ApiProperty({
    description: 'Instagram do usuário',
    type: 'string',
    nullable: true,
    maxLength: 250
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  instagram: string;

  @ApiProperty({
    description: 'Linkedin do usuário',
    type: 'string',
    nullable: true,
    maxLength: 250
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  linkedin: string;

  @ApiProperty({
    description: 'Skype do usuário',
    type: 'string',
    nullable: true,
    maxLength: 250
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  skype: string;

  @ApiProperty({
    description: 'Telefone do usuário',
    type: 'string',
    nullable: false,
    maxLength: 25
  })
  @IsOptional()
  @MaxLength(25, { message: DTO.MAX_LENGTH_25 })
  phone: string;

  @ApiProperty({
    description: 'Data de nascimento do usuário',
    nullable: false
  })
  @IsOptional()
  birthday: Date;

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

  @ApiProperty({
    description: 'Prioriza regra do grupo',
    type: 'boolean',
    nullable: true,
    default: false
  })
  @IsOptional()
  groupRule: boolean;

  @ApiProperty({
    description: 'Identificadores dos grupos',
    nullable: false,
    required: true
  })
  @IsOptional()
  groups: number[];
}

export class UserUpdateDTO {
  @ApiProperty({
    description: 'Nome de usuário',
    type: 'string',
    nullable: true,
    minLength: 2,
    maxLength: 200
  })
  @IsOptional()
  @Length(2, 200, { message: DTO.LENGTH_2_200 })
  username: string;

  @ApiProperty({
    description: 'Facebook do usuário',
    type: 'string',
    nullable: true,
    maxLength: 250
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  facebook: string;

  @ApiProperty({
    description: 'Instagram do usuário',
    type: 'string',
    nullable: true,
    maxLength: 250
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  instagram: string;

  @ApiProperty({
    description: 'Linkedin do usuário',
    type: 'string',
    nullable: true,
    maxLength: 250
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  linkedin: string;

  @ApiProperty({
    description: 'Skype do usuário',
    type: 'string',
    nullable: true,
    maxLength: 250
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  skype: string;

  @ApiProperty({
    description: 'Telefone do usuário',
    type: 'string',
    nullable: false,
    maxLength: 25
  })
  @IsOptional()
  @MaxLength(25, { message: DTO.MAX_LENGTH_25 })
  phone: string;

  @ApiProperty({
    description: 'Data de nascimento do usuário',
    nullable: false
  })
  @IsOptional()
  birthday: Date;

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

  @ApiProperty({
    description: 'Prioriza regra do grupo',
    type: 'boolean',
    nullable: true,
    default: false
  })
  @IsOptional()
  groupRule: boolean;

  @ApiProperty({
    description: 'Identificador do grupo',
    nullable: false,
    required: false
  })
  @IsOptional()
  groups: number[];
}

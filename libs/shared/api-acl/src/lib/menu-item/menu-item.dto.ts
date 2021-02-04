import { ApiProperty } from '@nestjs/swagger';
import { DTO } from '@of5/shared/api-shared';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { MenuItemEntity } from './menu-item.entity';

export class SaveMenuItemDTO {
  @ApiProperty({
    description: 'Nome do menu item',
    type: 'string',
    maxLength: 250,
    nullable: false
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  description: string;

  @ApiProperty({
    description: 'Tipo do menu item',
    type: 'boolean',
    nullable: false,
    default: true
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  type: boolean;

  @ApiProperty({
    description: 'Rota do menu item',
    type: 'string',
    maxLength: 250,
    nullable: false
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  route: string;

  @ApiProperty({
    type: 'integer',
    description: 'Caso o tipo for sub item: false, então este atributo passa a ser obrigatório'
  })
  @IsOptional()
  menuItem: MenuItemEntity;
}

export class UpdateMenuItemDTO {
  @ApiProperty({
    description: 'Nome do menu item',
    type: 'string',
    maxLength: 250,
    nullable: false
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  description: string;

  @ApiProperty({
    description: 'Tipo do menu item',
    type: 'boolean',
    nullable: false,
    default: true
  })
  @IsOptional()
  type: boolean;

  @ApiProperty({
    description: 'Rota do menu item',
    type: 'string',
    maxLength: 250,
    nullable: false
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  route: string;

  @ApiProperty({
    type: 'integer',
    description: 'Caso o tipo for sub item: false, então este atributo passa a ser obrigatório'
  })
  @IsOptional()
  menuItem: MenuItemEntity;
}

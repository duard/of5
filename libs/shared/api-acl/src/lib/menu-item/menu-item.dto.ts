import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { MenuItem } from 'src/entities/menu-item.entity';
import { DTO } from 'src/enums/translate/dto.enum';

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
  menuItem: MenuItem;
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
  menuItem: MenuItem;
}

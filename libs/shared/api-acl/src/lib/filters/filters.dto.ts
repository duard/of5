import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFilterDTO {
  @IsNotEmpty({ message: 'Informe o nome do campo' })
  @ApiProperty({ required: true })
  fieldName: string;

  @IsOptional()
  @ApiProperty({ required: false })
  operation: string;

  @IsNotEmpty({ message: 'Informe o valor do filtro' })
  @ApiProperty({ required: true })
  value: string;
}

export class UpdateFilterDTO {
  @IsOptional()
  @ApiProperty({ required: false })
  fieldName: string;

  @IsOptional()
  @ApiProperty({ required: false })
  operation: string;

  @IsOptional()
  @ApiProperty({ required: false })
  value: string;
}

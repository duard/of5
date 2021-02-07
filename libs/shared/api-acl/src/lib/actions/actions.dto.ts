import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateActionDTO {
  @IsNotEmpty({ message: 'Informe um nome' })
  @ApiProperty({ required: true })
  name: string;

  @IsNotEmpty({ message: 'Informe uma key' })
  @ApiProperty({ required: true })
  key: string;

  @IsOptional()
  @ApiProperty({ required: false })
  icon: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  type: string;
}

export class UpdateActionDTO {
  @IsOptional()
  @ApiProperty({ required: false })
  name: string;

  @IsOptional()
  @ApiProperty({ required: false })
  icon: string;

  @IsOptional()
  @ApiProperty({ required: false })
  type: string;
}

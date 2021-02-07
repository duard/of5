import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateGroupDTO {
  @IsNotEmpty({ message: 'Informe um nome' })
  @ApiProperty({ required: true })
  name: string;
}

export class UpdateGroupDTO {
  @IsOptional()
  @ApiProperty({ required: false })
  name: string;
}

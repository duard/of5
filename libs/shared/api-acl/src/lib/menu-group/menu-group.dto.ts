import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { DTO } from 'src/enums/translate/dto.enum';

export class MenuGroupCreateDTO {
  @ApiProperty({
    description: 'descrição menu grupo',
    nullable: false
  })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  description: string;
}

export class MenuGroupUpdateDTO {
  @ApiProperty({
    description: 'descrição menu grupo',
    nullable: true
  })
  @IsOptional()
  @MaxLength(250, { message: DTO.MAX_LENGTH_250 })
  description: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { DTO } from '@of5/shared/api-shared';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { UserCreateDTO } from '../users/user.dto';

export class AuthSignUpDto extends UserCreateDTO {}

export class AuthSignInDto {
  @IsEmail({}, { message: DTO.IS_EMAIL })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  @ApiProperty({ name: 'email', description: 'User email' })
  email: string;

  @ApiProperty({ name: 'password', description: 'User password' })
  @IsNotEmpty({ message: DTO.IS_NOT_EMPTY })
  password: string;
}

export class AuthMailVerifyDto {
  @ApiProperty({ name: 'email', description: 'E-mail', nullable: false })
  @IsEmail()
  email: string;
}

export class AuthVerifyCodeDto {
  @ApiProperty({ name: 'email', description: 'E-mail', nullable: false })
  @IsEmail()
  email: string;

  @ApiProperty({ name: 'code', description: 'código de verificação', nullable: false })
  @IsNumber()
  code: number;
}

export class RecoveryPasswordDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

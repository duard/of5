import { Body, Controller, Get, HttpCode, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ErrorService } from '@of5/shared/api-shared';
import { BinaryFile } from '@of5/shared/interfaces';
import { Request } from 'express';

import { AuthSignInDto, AuthSignUpDto } from './auth.dto';
import { AuthService } from './auth.service';
import { FacebookAuthGuard } from './facebook-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LinkedInAuthGuard } from './linkedin-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiParam({
    name: 'file',
    description: 'Foto do usuário para ser feito o upload',
    required: false,
    type: 'File'
  })
  @UseInterceptors(FileInterceptor('file'))
  async signUp(@Body() authDto: AuthSignUpDto, @UploadedFile('file') media: BinaryFile) {
    try {
      return await this.authService.signUp(authDto, media);
    } catch (error) {
      await ErrorService.next(error);
    }
  }

  @Post('/signin')
  @HttpCode(200)
  async signIn(@Req() req: Request, @Body() authDto: AuthSignInDto) {
    try {
      return await this.authService.signIn(req, authDto);
    } catch (error) {
      await ErrorService.next(error);
    }
  }

  @Post('verify-token')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async verifyToken() {
    return;
  }

  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    return;
  }

  @Get('/google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: Request) {
    try {
      return await this.authService.googleLogin(req);
    } catch (error) {
      await ErrorService.next(error);
    }
  }

  @Get('/facebook')
  @UseGuards(FacebookAuthGuard)
  async facebookAuth() {
    return;
  }

  @Get('/facebook/redirect')
  @UseGuards(FacebookAuthGuard)
  async facebookAuthRedirect(@Req() req: Request) {
    try {
      return await this.authService.facebookLogin(req);
    } catch (error) {
      await ErrorService.next(error);
    }
  }

  @Get('/linkedin')
  @UseGuards(LinkedInAuthGuard)
  async linkedinAuth() {
    return;
  }

  @Get('/linkedin/redirect')
  @UseGuards(LinkedInAuthGuard)
  async linkedinLogin(@Req() req: Request) {
    try {
      return await this.authService.linkedinLogin(req);
    } catch (error) {
      await ErrorService.next(error);
    }
  }
}

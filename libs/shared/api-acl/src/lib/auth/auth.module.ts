import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AwsModule } from '@of5/shared/api-shared';

import { FacebookStrategy } from './auth-facebook.strategy';
import { GoogleStrategy } from './auth-google.strategy';
import { LinkedinStrategy } from './auth-linkedin.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.stategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: '8h'
      }
    }),
    AwsModule
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, FacebookStrategy, LinkedinStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule, GoogleStrategy, FacebookStrategy, LinkedinStrategy]
})
export class AuthModule {}

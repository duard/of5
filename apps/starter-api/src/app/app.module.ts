import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiCoreModule } from '@of5/shared/api-core';
import { ApiAclModule } from '@of5/shared/api-acl';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config';
import { DatabaseConfig } from './database.config';
import { ApiSharedModule } from '@of5/shared/api-shared';

@Module({
  imports: [
    ApiCoreModule,
    ApiSharedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig
    }),

    ApiAclModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

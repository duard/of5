import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiCoreModule, ApiLoggerMiddleware } from '@of5/shared/api-core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config';
import { DatabaseConfig } from './database.config';

@Module({
  imports: [
    ApiCoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

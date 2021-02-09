import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiAclModule } from '@of5/shared/api-acl';
import { ApiCoreModule } from '@of5/shared/api-core';
import { ApiSharedModule } from '@of5/shared/api-shared';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config';
import { DatabaseConfig } from './database.config';

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
export class AppModule {
  constructor(private configService: ConfigService) {
    const dbConfig = this.configService.get('database');
    console.log('AppModule\n\n');
    if (process.env.NODE_ENV !== 'production') {
      Logger.debug(process.env.DB_HOST, 'HOSTNAME');
      Logger.debug(process.env.DB_USER, 'USERNAME');
      Logger.debug(process.env.DB_PASS, 'PASSWORD');
      Logger.debug(process.env.DB_NAME, 'DATABASE');
    }
    console.log('config', dbConfig);
  }
}

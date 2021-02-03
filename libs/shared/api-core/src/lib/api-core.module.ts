import 'winston-daily-rotate-file';

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ApiLoggerMiddleware } from './middlewares/api-logger.middleware';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.timestamp(), nestWinstonModuleUtilities.format.nestLike()),
          handleExceptions: true,
        }),
        new (winston.transports as any).DailyRotateFile({
          format: winston.format.combine(winston.format.timestamp(), winston.format.logstash()),
          filename: 'logs/info-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '1d',
          level: 'info',
        }),
        new winston.transports.DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '1d',
          level: 'error',
          format: winston.format.combine(winston.format.timestamp(), winston.format.logstash()),
        }),
      ],
      exceptionHandlers: [
        new winston.transports.DailyRotateFile({
          filename: 'logs/exception-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '1d',
          format: winston.format.combine(winston.format.timestamp(), winston.format.logstash()),
        }),
      ],
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class ApiCoreModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ApiLoggerMiddleware).forRoutes('*');
  }
}

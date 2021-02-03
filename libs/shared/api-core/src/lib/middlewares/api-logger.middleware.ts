import { Inject, Injectable, LoggerService, NestMiddleware } from '@nestjs/common';
import * as chalk from 'chalk';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class ApiLoggerMiddleware implements NestMiddleware {
  isDev = process.env.NODE_ENV === 'development' || 'Development' || 'qa';
  // private logger = new Logger('HTTP');
  private os = require('os');

  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    // const { ip, method, path: url } = request;
    // const userAgent = request.get('user-agent') || '';
    const { statusCode, statusMessage } = response;
    const contentLength = response.get('content-length');

    const { ip, method, originalUrl: url } = request;
    const hostname = this.os.hostname();
    const host = request.get('host') || '';
    const userAgent = request.get('user-agent') || '';
    const referer = request.get('referer') || '';

    const status = parseInt(method);
    let statusColor = '#5aff40';

    if (status >= 500) {
      statusColor = '#FF0000';
    } else if (status >= 400) {
      statusColor = '#FF0000';
    } else if (status >= 300) {
      statusColor = '#40ffca';
    } else {
      statusColor = '#FFEEEE';
    }

    const statusIcon = status >= 500 ? '😠 :' : status >= 400 ? '😫' : status >= 300 ? '🙂' : '😁';

    const token = request.body.token || request.query.token || request.headers['authorization'];

    response.on('close', () => {
      if (!token) {
        console.log(chalk.yellow.bgHex('#FF0000')(`TOKEN NÃO ENVIADO NO HEADER`));
      }

      this.logger.log(
        `${method} ${statusCode} ${referer} ${url}  - ${contentLength} - ${ip} [${hostname}] ${userAgent} `
      );
      if (this.isDev) {
        console.log(
          '\n',
          chalk.hex('#000000').bgHex('#FFFFFF')('=>'),

          chalk.hex('#708090')(userAgent),
          '\n',
          chalk.hex('#000000').bgHex('#FFFFFF')('=>'),
          chalk.hex(statusColor).bold(method),
          chalk.hex(statusColor).bold(statusCode),
          chalk.hex(statusColor).bold(host + url),
          chalk.hex(statusColor).bold(statusMessage),
          chalk.hex(statusColor).bold(contentLength),
          chalk.hex('#ff4757').bold(statusIcon),
          '\n',
          chalk.hex('#000000').bgHex('#FFFFFF')('=>'),
          // chalk.hex('#FF69B4').bold(usuarioLogado),
          chalk.yellow(`[${hostname}] ${ip} `),
          chalk.hex('#fffa65').bold('from ' + referer),
          '\n',
          chalk.hex('#000000').bgHex('#FFFFFF')('=>'),
          chalk.hex('#FF69B4').bold('PARAMS ' + JSON.stringify(request.params)),
          '\n',
          chalk.hex('#000000').bgHex('#FFFFFF')('=>'),
          chalk.hex('#CD853F').bold('QUERY ' + JSON.stringify(request.query)),
          '\n',
          chalk.hex('#000000').bgHex('#FFFFFF')('=>'),
          chalk.hex('#CD853F').bold('BODY ' + JSON.stringify(request.body))
        );
      }
    });
    next();
  }
}

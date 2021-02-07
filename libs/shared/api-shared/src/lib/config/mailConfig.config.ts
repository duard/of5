import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

export const mailConfig = {
  transport: {
    host: process.env.MAIL_TRANSPORT,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  },
  default: {
    from: `Starter <${process.env.CONNECT_EMAIL}>`
  },
  template: {
    dir: path.join('src/views/email'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true
    }
  },
  options: {
    layouts: {
      dir: path.join('src/views/email/layouts'),
      options: {
        strict: true
      }
    },
    partials: {
      dir: path.join('src/views/email/partials'),
      options: {
        strict: true
      }
    }
  }
};

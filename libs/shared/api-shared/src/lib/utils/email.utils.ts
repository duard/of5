import * as nodemailer from 'nodemailer';
import * as nodemailerSendgrid from 'nodemailer-sendgrid';
import * as EmailTemplate from 'email-templates';
import * as path from 'path';
import * as Mail from 'nodemailer/lib/mailer';

import * as pug from 'pug';

export class Email {
  email: Mail;

  constructor() {}

  send(to: string, title: string, html: string): Promise<any> {
    console.log('process.env.EMAIL_HOST', process.env.EMAIL_HOST);

    this.email = nodemailer.createTransport(nodemailerSendgrid({ apiKey: process.env.EMAIL_PASS }));

    const blutvEnv = `blutv.${process.env.NODE_ENV}`;

    return this.email.sendMail({
      from: `BluTV - <credenciamento@blutv.com.br`,
      to,
      subject: title,
      text: title,
      html
    });
  }

  sendEmailPug(to: string, title: string, pathFile: string, params: any): Promise<any> {
    console.log('process.env.EMAIL_HOST', process.env.EMAIL_HOST);

    this.email = nodemailer.createTransport(nodemailerSendgrid({ apiKey: process.env.EMAIL_PASS }));

    const blutvEnv = `blutv.${process.env.NODE_ENV}`;

    return this.email.sendMail({
      from: `BluTV - credenciamento@minhablutv.com.br`,
      to,
      subject: title,
      text: title,
      html: pug.renderFile(pathFile, params)
    });
  }

  // sendTest(to: string, title: string, html: string) {
  //   const mailer = nodemailer.createTransport(nodemailerSendgrid({ apiKey: process.env.EMAIL_PASS }));

  //   const email = new EmailTemplate({
  //     message: {
  //       from: 'hi@example.com',
  //     },
  //     send: true,
  //     transport: mailer,
  //     // views: { root:  }
  //   });

  //   email.send({
  //     template: 'template',
  //     message: {
  //       to,
  //     },
  //     locals: {
  //       firstName: 'Elon',
  //       lastName: 'test',
  //     },
  //   });
  // }
}

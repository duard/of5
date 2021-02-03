import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class TranslateService {
  constructor(private readonly i18n: I18nService) {}

  async translateMessage(message: string, req: Request, language?: string) {
    try {
      // Default language
      const lang = this.getLanguageFromRequest(req, language);

      if (message.startsWith('MSG_I18N_')) {
        const str = message.substring(9);
        return await this.i18n.translate(str, { lang });
      }

      return message;
    } catch (err) {
      return message;
    }
  }

  private getLanguageFromRequest(request: any, language?: string): string {
    if (language) {
      return language;
    }

    let lang = 'pt-br';
    let getFromHeader = false;

    // Pega lang do header
    if (request.headers.lang) {
      lang = request.headers.lang;
      getFromHeader = true;
    }

    // Pega lang da query
    if (request.query.lang && !getFromHeader) {
      lang = request.query.lang;
    }

    return lang;
  }
}

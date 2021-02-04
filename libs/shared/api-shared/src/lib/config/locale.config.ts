import { AcceptLanguageResolver, CookieResolver, HeaderResolver, I18nJsonParser, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

export const localeConfig = {
  fallbackLanguage: 'pt-br',
  fallbacks: {
    en: 'en',
    es: 'es'
  },
  parser: I18nJsonParser,
  parserOptions: {
    path: path.join('src/i18n/'),
    watch: true
  },
  resolvers: [
    { use: QueryResolver, options: ['lang', 'locale', 'l'] },
    new HeaderResolver(['x-custom-lang']),
    AcceptLanguageResolver,
    new CookieResolver(['lang', 'locale', 'l'])
  ]
};

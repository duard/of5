import { I18nRequestScopeService } from 'nestjs-i18n';

export const authMessages = async (i18n: I18nRequestScopeService, lang: any): Promise<any> => ({
  emailExists: await i18n.translate('auth.MAIL_EXISTS', { lang }),
  invalidCredentials: await i18n.translate('auth.INVALID_CREDENTIALS', { lang }),
  notFound: await i18n.translate('auth.NOT_FOUND', { lang }),
  invalidCode: await i18n.translate('auth.INVALID_CODE', { lang }),
  expiredCode: await i18n.translate('auth.EXPIRED_CODE', { lang })
});

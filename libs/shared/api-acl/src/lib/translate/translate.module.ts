import { Module } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { TranslateService } from './translate.service';

@Module({
  providers: [TranslateService, I18nService],
  exports: [TranslateService]
})
export class TranslateModule {}

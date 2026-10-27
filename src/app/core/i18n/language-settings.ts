/**
 * LanguageSettings
 *
 * Resolves the initial language, changes it and persists the user's choice.
 *
 * @author adrianpmdev
 */

import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageSettings {
  private translate = inject(TranslateService);

  private readonly langKey = 'lang';
  private readonly defaultLang = 'es';
  private readonly supportedLangs = ['es', 'en', 'fr'];

  initLang(): string {
    const lang = this.getCurrentLang();
    this.setLang(lang);
    return lang;
  }

  getCurrentLang(): string {
    const stored = localStorage.getItem(this.langKey);
    if (stored && this.supportedLangs.includes(stored)) return stored;

    const browserLang = typeof navigator !== 'undefined'
      ? (navigator.language || (navigator as any).userLanguage || '')
      : '';
    const normalized = browserLang ? browserLang.slice(0, 2).toLowerCase() : '';

    return this.supportedLangs.includes(normalized) ? normalized : this.defaultLang;
  }

  setLang(lang: string): void {
    const finalLang = this.supportedLangs.includes(lang) ? lang : this.defaultLang;
    localStorage.setItem(this.langKey, finalLang);
    this.translate.use(finalLang);
  }
}
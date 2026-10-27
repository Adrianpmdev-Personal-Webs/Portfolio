/**
 * AccessLogger
 *
 * Sends fire-and-forget portfolio events (desktop access, CV download,
 * LinkedIn click) to /api/log-access, with the user name, device, platform and
 * language.
 *
 * @author adrianpmdev
 */

import { Injectable, inject } from '@angular/core';
import { LanguageSettings } from '../i18n/language-settings';
import { UserSession } from '../session/user-session';
import {
  AccessInfo,
  DeviceCategory,
  DevicePlatform,
  LogEventType,
} from './access-info';

@Injectable({ providedIn: 'root' })
export class AccessLogger {
  private readonly LOG_ENDPOINT = '/api/log-access';
  private readonly languageSettings = inject(LanguageSettings);
  private readonly userSession = inject(UserSession);

  logDesktopAccess(): void {
    this.sendLog('desktop');
  }

  logCvDownload(): void {
    this.sendLog('cv');
  }

  logLinkedinClick(): void {
    this.sendLog('linkedin');
  }

  private sendLog(event: LogEventType): void {
    const info: AccessInfo = {
      event,
      userName: this.userSession.getUserName() || 'desconocido',
      device: this.detectDevice(),
      platform: this.detectPlatform(),
      lang: this.languageSettings.getCurrentLang(),
    };

    fetch(this.LOG_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    }).catch(() => {

    });
  }

  private detectDevice(): DeviceCategory {
    const ua = navigator.userAgent;
    const isCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
    const isTabletUA = /iPad|Tablet/i.test(ua);
    const isMobileUA = /Mobi|Android|iPhone|iPod|Windows Phone/i.test(ua);

    const looksLikeIpad = /Macintosh/i.test(ua) && isCoarsePointer && navigator.maxTouchPoints > 1;

    if (isTabletUA || looksLikeIpad) return 'tablet';
    if (isMobileUA || (isCoarsePointer && window.innerWidth < 768)) return 'movil';
    return 'ordenador';
  }

  private detectPlatform(): DevicePlatform {
    const ua = navigator.userAgent;
    const uaData = (navigator as any).userAgentData;

    if (uaData?.platform) {
      const p = uaData.platform as string;
      if (/android/i.test(p)) return 'Android';
      if (/chrome os|cros/i.test(p)) return 'ChromeOS';
      if (/windows/i.test(p)) return 'Windows';
    }

    const isCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
    const looksLikeIpad =
      /Macintosh/i.test(ua) && isCoarsePointer && navigator.maxTouchPoints > 1;

    if (/iPhone/i.test(ua)) return 'iPhone';
    if (/iPad/i.test(ua) || looksLikeIpad) return 'iPad';
    if (/Android/i.test(ua)) return 'Android';
    if (/CrOS/i.test(ua)) return 'ChromeOS';
    if (/Windows/i.test(ua)) return 'Windows';
    if (/Macintosh|Mac OS X/i.test(ua)) return 'macOS';
    if (/Linux/i.test(ua)) return 'Linux';

    return 'Desconocido';
  }
}
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
import { DeviceDetector } from '../device/device-detector';
import { LanguageSettings } from '../i18n/language-settings';
import { UserSession } from '../session/user-session';
import { AccessInfo, LogEventType } from './access-info';

@Injectable({ providedIn: 'root' })
export class AccessLogger {
  private readonly endpoint = '/api/log-access';
  private readonly deviceDetector = inject(DeviceDetector);
  private readonly languageSettings = inject(LanguageSettings);
  private readonly userSession = inject(UserSession);

  logDesktopAccess(): void {
    this.send('desktop');
  }

  logCvDownload(): void {
    this.send('cv');
  }

  logLinkedinClick(): void {
    this.send('linkedin');
  }

  private send(event: LogEventType): void {
    const info: AccessInfo = {
      event,
      userName: this.userSession.getUserName() || 'desconocido',
      device: this.deviceDetector.category(),
      platform: this.deviceDetector.platform(),
      lang: this.languageSettings.currentLang(),
    };

    fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
      keepalive: true,
    }).catch(() => undefined);
  }
}

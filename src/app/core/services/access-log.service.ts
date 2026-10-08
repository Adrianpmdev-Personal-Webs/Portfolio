import { Injectable, inject } from '@angular/core';
import { LanguageService } from './language.service';
import { UserSessionService } from './user-session.service';
import {
  AccessInfo,
  DeviceCategory,
  DevicePlatform,
  LogEventType,
} from '../models/device-info.model';

/**
 * Envía logs.
 *
 * @author adrianpmdev
 */
@Injectable({ providedIn: 'root' })
export class AccessLogService {
  private readonly LOG_ENDPOINT = '/api/log-access';
  private languageService = inject(LanguageService);
  private userSession = inject(UserSessionService);

  logDesktopAccess(): void {
    this.sendLog('desktop');
  }

  logCvDownload(): void {
    this.sendLog('cv');
  }

  logLinkedinClick(): void {
    this.sendLog('linkedin');
  }

  /**
   * Construye y envía el payload del evento. La llamada es
   * "fire and forget": nunca bloquea ni rompe la navegación aunque falle
   * el endpoint.
   */
  private sendLog(event: LogEventType): void {
    const info: AccessInfo = {
      event,
      userName: this.userSession.getUserName() || 'desconocido',
      device: this.detectDevice(),
      platform: this.detectPlatform(),
      lang: this.languageService.getCurrentLang(),
    };

    fetch(this.LOG_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    }).catch(() => {

    });
  }

  /**
   * Detecta el tipo de dispositivo combinando el user-agent con
   * `matchMedia`, para cubrir bien casos límite (iPad que se identifica
   * como "Macintosh", navegadores con UA modificado, etc.).
   */
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

  /**
   * Detecta la plataforma/SO concreto (iPhone, iPad, Android, Windows,
   * macOS, Linux, ChromeOS) a partir del user-agent y, cuando está
   * disponible, de la User-Agent Client Hints API.
   */
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
/**
 * DeviceDetector
 *
 * Detects the device category (mobile, tablet, desktop) and platform from the
 * user agent, pointer type and User-Agent Client Hints, covering iPads that
 * report themselves as Macs.
 *
 * @author adrianpmdev
 */

import { DOCUMENT, Injectable, inject } from '@angular/core';
import { DeviceCategory, DevicePlatform } from './device';

type NavigatorWithUAData = Navigator & { userAgentData?: { platform?: string } };

@Injectable({ providedIn: 'root' })
export class DeviceDetector {
  private readonly window = inject(DOCUMENT).defaultView!;

  category(): DeviceCategory {
    const ua = this.window.navigator.userAgent;
    const isTabletUA = /iPad|Tablet/i.test(ua);
    const isMobileUA = /Mobi|Android|iPhone|iPod|Windows Phone/i.test(ua);

    if (isTabletUA || this.looksLikeIpad()) return 'tablet';
    if (isMobileUA || (this.hasCoarsePointer() && this.window.innerWidth < 768)) return 'movil';
    return 'ordenador';
  }

  isDesktop(): boolean {
    return this.category() === 'ordenador';
  }

  platform(): DevicePlatform {
    const navigator = this.window.navigator as NavigatorWithUAData;
    const ua = navigator.userAgent;
    const hintedPlatform = navigator.userAgentData?.platform;

    if (hintedPlatform) {
      if (/android/i.test(hintedPlatform)) return 'Android';
      if (/chrome os|cros/i.test(hintedPlatform)) return 'ChromeOS';
      if (/windows/i.test(hintedPlatform)) return 'Windows';
    }

    if (/iPhone/i.test(ua)) return 'iPhone';
    if (/iPad/i.test(ua) || this.looksLikeIpad()) return 'iPad';
    if (/Android/i.test(ua)) return 'Android';
    if (/CrOS/i.test(ua)) return 'ChromeOS';
    if (/Windows/i.test(ua)) return 'Windows';
    if (/Macintosh|Mac OS X/i.test(ua)) return 'macOS';
    if (/Linux/i.test(ua)) return 'Linux';

    return 'Desconocido';
  }

  private hasCoarsePointer(): boolean {
    return this.window.matchMedia('(pointer: coarse)').matches;
  }

  private looksLikeIpad(): boolean {
    const { userAgent, maxTouchPoints } = this.window.navigator;
    return /Macintosh/i.test(userAgent) && this.hasCoarsePointer() && maxTouchPoints > 1;
  }
}

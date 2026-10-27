/**
 * Fullscreen
 *
 * Enters and leaves browser fullscreen, ignoring browsers or contexts where
 * the Fullscreen API is unavailable or the request is rejected.
 *
 * @author adrianpmdev
 */

import { DOCUMENT, Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Fullscreen {
  private readonly document = inject(DOCUMENT);

  async enter(): Promise<void> {
    if (!this.document.fullscreenEnabled || this.document.fullscreenElement) return;
    await this.document.documentElement.requestFullscreen().catch(() => undefined);
  }

  async exit(): Promise<void> {
    if (!this.document.fullscreenElement) return;
    await this.document.exitFullscreen().catch(() => undefined);
  }
}

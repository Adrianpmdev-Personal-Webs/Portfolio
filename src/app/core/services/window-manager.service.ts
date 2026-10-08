import { Injectable, signal } from '@angular/core';
import { DesktopWindow } from '../models/desktop-window.model';
import { OpenWindowConfig } from '../models/open-window-config.model';

/**
 * Fuente de verdad del estado de las ventanas del escritorio (abiertas,
 * minimizadas, foco y orden de apilado). Expone el estado como una signal
 * de solo lectura; {@link DesktopComponent} es quien la consume para
 * renderizar cada ventana y orquestar sus animaciones.
 *
 * @author adrianpmdev
 */
@Injectable({ providedIn: 'root' })
export class WindowManagerService {
  private readonly zBase = 100;
  private zCounter = this.zBase;

  readonly windows = signal<DesktopWindow[]>([]);

  openWindow(config: OpenWindowConfig): void {
    const existing = this.windows().find((w) => w.id === config.id);

    if (existing) {
      this.restoreWindow(config.id);
      this.focusWindow(config.id);
      return;
    }

    this.zCounter += 1;
    const next: DesktopWindow = {
      id: config.id,
      titleKey: config.titleKey,
      iconSrc: config.iconSrc,
      content: config.content,
      appType: config.appType,
      state: 'open',
      active: true,
      zIndex: this.zCounter,
    };

    const deactivated = this.windows().map((w) => ({ ...w, active: false }));
    this.windows.set([...deactivated, next]);
  }

  focusWindow(id: string): void {
    this.zCounter += 1;
    this.windows.set(
      this.windows().map((w) => {
        if (w.id === id && w.state === 'open') {
          return { ...w, active: true, zIndex: this.zCounter };
        }
        return { ...w, active: false };
      })
    );
  }

  minimizeWindow(id: string): void {
    this.windows.set(
      this.windows().map((w) => {
        if (w.id === id) {
          return { ...w, state: 'minimized', active: false };
        }
        return w;
      })
    );

    this.activateTopOpenWindow();
  }

  restoreWindow(id: string): void {
    this.zCounter += 1;
    this.windows.set(
      this.windows().map((w) => {
        if (w.id === id) {
          return { ...w, state: 'open', active: true, zIndex: this.zCounter };
        }
        return { ...w, active: false };
      })
    );
  }

  closeWindow(id: string): void {
    this.windows.set(this.windows().filter((w) => w.id !== id));
    this.activateTopOpenWindow();
  }

  reset(): void {
    this.zCounter = this.zBase;
    this.windows.set([]);
  }

  private activateTopOpenWindow(): void {
    const openWindows = this.windows().filter((w) => w.state === 'open');
    if (openWindows.length === 0) return;

    const top = [...openWindows].sort((a, b) => b.zIndex - a.zIndex)[0];
    this.focusWindow(top.id);
  }
}
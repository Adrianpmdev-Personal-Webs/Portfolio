/**
 * WindowManager
 *
 * Source of truth for desktop windows (open/minimized, focus and stacking
 * order), exposed as a read-only signal.
 *
 * @author adrianpmdev
 */

import { Injectable, signal } from '@angular/core';
import { AppDefinition } from '../apps/app-definition';
import { DesktopWindow } from './desktop-window';

@Injectable({ providedIn: 'root' })
export class WindowManager {
  private readonly zBase = 100;
  private zCounter = this.zBase;

  private readonly windowsState = signal<DesktopWindow[]>([]);
  readonly windows = this.windowsState.asReadonly();

  openWindow(app: AppDefinition): void {
    const existing = this.windows().find((w) => w.id === app.id);

    if (existing) {
      this.restoreWindow(app.id);
      this.focusWindow(app.id);
      return;
    }

    this.zCounter += 1;
    const next: DesktopWindow = {
      id: app.id,
      app,
      state: 'open',
      active: true,
      zIndex: this.zCounter,
    };

    const deactivated = this.windows().map((w) => ({ ...w, active: false }));
    this.windowsState.set([...deactivated, next]);
  }

  focusWindow(id: string): void {
    this.zCounter += 1;
    this.windowsState.set(
      this.windows().map((w) => {
        if (w.id === id && w.state === 'open') {
          return { ...w, active: true, zIndex: this.zCounter };
        }
        return { ...w, active: false };
      }),
    );
  }

  minimizeWindow(id: string): void {
    this.windowsState.set(
      this.windows().map((w) => {
        if (w.id === id) {
          return { ...w, state: 'minimized', active: false };
        }
        return w;
      }),
    );

    this.activateTopOpenWindow();
  }

  restoreWindow(id: string): void {
    this.zCounter += 1;
    this.windowsState.set(
      this.windows().map((w) => {
        if (w.id === id) {
          return { ...w, state: 'open', active: true, zIndex: this.zCounter };
        }
        return { ...w, active: false };
      }),
    );
  }

  closeWindow(id: string): void {
    this.windowsState.set(this.windows().filter((w) => w.id !== id));
    this.activateTopOpenWindow();
  }

  reset(): void {
    this.zCounter = this.zBase;
    this.windowsState.set([]);
  }

  private activateTopOpenWindow(): void {
    const openWindows = this.windows().filter((w) => w.state === 'open');
    if (openWindows.length === 0) return;

    const top = [...openWindows].sort((a, b) => b.zIndex - a.zIndex)[0];
    this.focusWindow(top.id);
  }
}

/**
 * Desktop
 *
 * Desktop route. Shows the registered apps as icons, delegates window state to
 * WindowManager and animates opening, minimizing and closing with GSAP.
 *
 * @author adrianpmdev
 */

import { Component, DOCUMENT, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import gsap from 'gsap';
import { AppDefinition } from '../apps/app-definition';
import { APP_REGISTRY } from '../apps/app-registry';
import { UserSession } from '../../core/session/user-session';
import { DesktopIcon } from './desktop-icon/desktop-icon';
import { Taskbar } from './taskbar/taskbar';
import { WindowManager } from './window-manager';
import { XpWindow } from './xp-window/xp-window';

@Component({
  selector: 'app-desktop',
  imports: [DesktopIcon, Taskbar, XpWindow, TranslatePipe],
  templateUrl: './desktop.html',
  styleUrl: './desktop.scss',
})
export class Desktop {
  private readonly windowManager = inject(WindowManager);
  private readonly userSession = inject(UserSession);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly pendingOpenAnimations = new Set<string>();

  protected readonly apps = APP_REGISTRY;
  protected readonly userName = this.userSession.getUserName();
  protected readonly windows = this.windowManager.windows;

  constructor() {
    this.apps.forEach((app) => app.loadComponent());
  }

  protected openApp(app: AppDefinition): void {
    const existingWindow = this.windows().find((win) => win.id === app.id);
    const shouldAnimateIn = !existingWindow || existingWindow.state === 'minimized';

    if (shouldAnimateIn) {
      this.pendingOpenAnimations.add(app.id);
    }

    this.windowManager.openWindow(app);

    if (shouldAnimateIn) {
      this.animateWindowInWhenReady(app.id, existingWindow?.state === 'minimized');
    }
  }

  protected focusWindow(id: string): void {
    this.windowManager.focusWindow(id);
  }

  protected minimizeWindow(id: string): void {
    const element = this.getWindowElement(id);

    if (!element) {
      this.windowManager.minimizeWindow(id);
      return;
    }

    gsap.killTweensOf(element);

    gsap.to(element, {
      duration: 0.22,
      ease: 'power2.in',
      scale: 0.92,
      y: 24,
      opacity: 0,
      transformOrigin: 'center center',
      onComplete: () => {
        this.windowManager.minimizeWindow(id);
      },
    });
  }

  protected closeWindow(id: string): void {
    const element = this.getWindowElement(id);

    if (!element) {
      this.windowManager.closeWindow(id);
      return;
    }

    gsap.killTweensOf(element);

    gsap.to(element, {
      duration: 0.24,
      ease: 'power2.in',
      scale: 0.82,
      y: 36,
      opacity: 0,
      transformOrigin: 'center center',
      onComplete: () => {
        this.windowManager.closeWindow(id);
      },
    });
  }

  protected toggleWindowFromTaskbar(id: string): void {
    const win = this.windows().find((window) => window.id === id);
    if (!win) return;

    if (win.state === 'minimized') {
      this.pendingOpenAnimations.add(id);
      this.windowManager.restoreWindow(id);
      this.animateWindowInWhenReady(id, true);
      return;
    }

    if (win.active) {
      this.minimizeWindow(id);
      return;
    }

    this.windowManager.focusWindow(id);
  }

  protected logout(): void {
    this.userSession.clearUserName();
    this.router.navigateByUrl('/login');
  }

  protected async turnOff(): Promise<void> {
    this.windowManager.reset();

    if (this.document.fullscreenElement) {
      try {
        await this.document.exitFullscreen();
      } catch {}
    }

    this.router.navigateByUrl('/');
  }

  protected isPendingOpenAnimation(id: string): boolean {
    return this.pendingOpenAnimations.has(id);
  }

  private animateWindowInWhenReady(id: string, isRestore = false, attempt = 0): void {
    const element = this.getWindowElement(id);

    if (!element) {
      if (attempt < 10) {
        requestAnimationFrame(() => this.animateWindowInWhenReady(id, isRestore, attempt + 1));
      } else {
        this.pendingOpenAnimations.delete(id);
      }
      return;
    }

    gsap.killTweensOf(element);

    gsap.fromTo(
      element,
      {
        autoAlpha: 0,
        filter: isRestore ? 'blur(1px)' : 'blur(2px)',
      },
      {
        duration: 0.24,
        ease: 'power2.out',
        autoAlpha: 1,
        filter: 'blur(0px)',
        clearProps: 'opacity,visibility,filter',
        onComplete: () => {
          this.pendingOpenAnimations.delete(id);
        },
      },
    );
  }

  private getWindowElement(id: string): HTMLElement | null {
    return this.document.querySelector<HTMLElement>(`[data-window-id="${id}"]`);
  }
}

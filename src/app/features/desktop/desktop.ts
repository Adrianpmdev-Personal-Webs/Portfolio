/**
 * Desktop
 *
 * Desktop route. Shows the registered apps as icons, delegates window state to
 * WindowManager and animates opening, minimizing and closing with GSAP.
 *
 * @author adrianpmdev
 */

import { Component, DestroyRef, ElementRef, Injector, afterNextRender, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import gsap from 'gsap';
import { Fullscreen } from '../../core/fullscreen/fullscreen';
import { UserSession } from '../../core/session/user-session';
import { AppDefinition } from '../apps/app-definition';
import { APP_REGISTRY } from '../apps/app-registry';
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
  private readonly fullscreen = inject(Fullscreen);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly animations = gsap.context(() => {}, this.host);

  protected readonly apps = APP_REGISTRY;
  protected readonly userName = this.userSession.getUserName();
  protected readonly windows = this.windowManager.windows;

  constructor() {
    this.apps.forEach((app) => app.loadComponent());
    inject(DestroyRef).onDestroy(() => this.animations.kill());
  }

  protected async openApp(app: AppDefinition): Promise<void> {
    const component = await app.loadComponent();
    const existingWindow = this.windows().find((win) => win.id === app.id);
    const shouldAnimateIn = !existingWindow || existingWindow.state === 'minimized';

    this.windowManager.openWindow(app, component);

    if (shouldAnimateIn) {
      this.animateWindowInAfterRender(app.id, existingWindow?.state === 'minimized');
    }
  }

  protected focusWindow(id: string): void {
    this.windowManager.focusWindow(id);
  }

  protected minimizeWindow(id: string): void {
    this.animateWindowOut(id, { duration: 0.22, scale: 0.92, y: 24 }, () => this.windowManager.minimizeWindow(id));
  }

  protected closeWindow(id: string): void {
    this.animateWindowOut(id, { duration: 0.24, scale: 0.82, y: 36 }, () => this.windowManager.closeWindow(id));
  }

  protected toggleWindowFromTaskbar(id: string): void {
    const win = this.windows().find((window) => window.id === id);
    if (!win) return;

    if (win.state === 'minimized') {
      this.windowManager.restoreWindow(id);
      this.animateWindowInAfterRender(id, true);
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
    await this.fullscreen.exit();
    this.router.navigateByUrl('/');
  }

  private animateWindowOut(
    id: string,
    motion: { duration: number; scale: number; y: number },
    onComplete: () => void,
  ): void {
    const element = this.getWindowElement(id);

    if (!element) {
      onComplete();
      return;
    }

    this.animations.add(() => {
      gsap.killTweensOf(element);
      gsap.to(element, {
        ...motion,
        ease: 'power2.in',
        opacity: 0,
        transformOrigin: 'center center',
        onComplete,
      });
    });
  }

  private animateWindowInAfterRender(id: string, isRestore: boolean): void {
    afterNextRender(
      () => {
        const element = this.getWindowElement(id);

        if (!element) return;

        this.animations.add(() => {
          gsap.killTweensOf(element);
          gsap.fromTo(
            element,
            { autoAlpha: 0, filter: isRestore ? 'blur(1px)' : 'blur(2px)' },
            {
              duration: 0.24,
              ease: 'power2.out',
              autoAlpha: 1,
              filter: 'blur(0px)',
              clearProps: 'opacity,visibility,filter',
            },
          );
        });
      },
      { injector: this.injector },
    );
  }

  private getWindowElement(id: string): HTMLElement | null {
    return this.host.querySelector<HTMLElement>(`[data-window-id="${id}"]`);
  }
}

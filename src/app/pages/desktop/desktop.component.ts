import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import gsap from 'gsap';
import { DesktopIconComponent } from '../../components/desktop-icon/desktop-icon.component';
import { XpTaskbarComponent } from '../../components/xp-taskbar/xp-taskbar.component';
import { WindowManagerService } from '../../core/services/window-manager.service';
import { MyPcComponent } from '../../apps/my-pc/my-pc.component';
import { InternetExplorerComponent } from '../../apps/internet-explorer/internet-explorer.component';
import { PhotoViewerComponent } from '../../apps/photo-viewer/photo-viewer.component';
import { OpenWindowConfig } from '../../core/models/open-window-config.model';
import { UserSessionService } from '../../core/services/user-session.service';
import { MinesweeperComponent } from '../../apps/minesweeper/minesweeper.component';

/**
 * Página "Escritorio": pantalla principal tras el login. Gestiona los
 * iconos del escritorio, delega en {@link WindowManagerService} el estado
 * de las ventanas abiertas y orquesta las animaciones de apertura, minimizado
 * y cierre de cada ventana con GSAP.
 *
 * @author adrianpmdev
 */
@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [
    CommonModule,
    DesktopIconComponent,
    XpTaskbarComponent,
    MyPcComponent,
    InternetExplorerComponent,
    PhotoViewerComponent,
    MinesweeperComponent,
    TranslatePipe,
  ],
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.scss',
})
export class DesktopComponent implements OnInit {
  private readonly windowManager = inject(WindowManagerService);
  private readonly userSessionService = inject(UserSessionService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly pendingOpenAnimations = new Set<string>();

  desktopApps: OpenWindowConfig[] = [
    {
      id: 'app1',
      titleKey: 'desktop.app1',
      appType: 'my-pc',
      iconSrc: '/assets/images/system/apps/my_pc.png',
    },
    {
      id: 'app2',
      titleKey: 'desktop.app2',
      appType: 'internet-explorer',
      iconSrc: '/assets/images/system/apps/explorer.png',
    },
    {
      id: 'app3',
      titleKey: 'desktop.app3',
      appType: 'photo-viewer',
      iconSrc: '/assets/images/system/apps/photo_viewer.png',
    },
    {
      id: 'app4',
      titleKey: 'desktop.app4',
      appType: 'minesweeper',
      iconSrc: '/assets/images/system/apps/minesweeper.png',
    },
  ]
  userName = '';

  readonly windows = this.windowManager.windows;

  ngOnInit(): void {
    this.userName = this.userSessionService.getUserName();
  }

  openApp(id: string): void {
    const current = this.desktopApps.find((app) => app.id === id);
    if (!current) return;

    const existingWindow = this.windows().find((win) => win.id === id);
    const shouldAnimateIn = !existingWindow || existingWindow.state === 'minimized';

    if (shouldAnimateIn) {
      this.pendingOpenAnimations.add(id);
    }

    this.windowManager.openWindow({
      id,
      titleKey: current.titleKey,
      appType: current.appType,
      iconSrc: current.iconSrc,
      content: '',
    });

    if (shouldAnimateIn) {
      this.animateWindowInWhenReady(id, existingWindow?.state === 'minimized');
    }
  }

  focusWindow(id: string): void {
    this.windowManager.focusWindow(id);
  }

  minimizeWindow(id: string): void {
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

  closeWindow(id: string): void {
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

  onTaskbarTabClick(id: string): void {
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

  onLogout(): void {
    this.userSessionService.clearUserName();
    this.router.navigateByUrl('/login');
  }

  async onTurnOff(): Promise<void> {
    this.windowManager.reset();

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch { }
    }

    this.router.navigateByUrl('/');
  }

  isPendingOpenAnimation(id: string): boolean {
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
      }
    );
  }

  private getWindowElement(id: string): HTMLElement | null {
    return this.document.querySelector<HTMLElement>(`[data-window-id="${id}"]`);
  }

  get desktopIcons() {
    return this.desktopApps.filter((app) => app.appType !== 'clippy-chat');
  }
}
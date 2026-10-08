import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';
import { DesktopWindow } from '../../core/models/desktop-window.model';
import { OpenWindowConfig } from '../../core/models/open-window-config.model';
import { LanguageService } from '../../core/services/language.service';

/**
 * Barra de tareas estilo Windows XP: botón de inicio con menú de apps y
 * selector de idioma, pestañas de ventanas abiertas/minimizadas, y reloj.
 * El reloj se sincroniza para actualizarse justo al cambiar de minuto en
 * vez de hacer polling cada segundo.
 *
 * @author adrianpmdev
 */
@Component({
  selector: 'app-xp-taskbar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    TranslatePipe,
    TitleCasePipe,
  ],
  templateUrl: './xp-taskbar.component.html',
  styleUrl: './xp-taskbar.component.scss',
})
export class XpTaskbarComponent implements OnDestroy {
  private readonly languageService = inject(LanguageService);

  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  @Input() windows: DesktopWindow[] = [];
  @Input() startMenuApps: OpenWindowConfig[] = [];
  @Input() userName = '';

  @Output() windowTabClick = new EventEmitter<string>();
  @Output() startApp = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();
  @Output() turnOff = new EventEmitter<void>();

  time = '';
  currentLang = 'ES';
  isAllProgramsOpen = false;

  constructor() {
    const lang = this.languageService.getCurrentLang();

    this.currentLang = lang.toUpperCase();

    this.updateTime();

    const now = new Date();
    const msToNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    this.timeoutId = setTimeout(() => {
      this.updateTime();

      this.intervalId = setInterval(
        () => this.updateTime(),
        60_000
      );

      this.timeoutId = null;
    }, msToNextMinute);

    if (msToNextMinute <= 0) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }

      this.intervalId = setInterval(
        () => this.updateTime(),
        60_000
      );
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  onWindowTabClick(id: string): void {
    this.windowTabClick.emit(id);
  }

  openApp(id: string): void {
    this.startApp.emit(id);
  }

  openAppByType(appType: string): void {
    const app = this.startMenuApps.find(
      (item) => item.appType === appType
    );

    if (!app) {
      return;
    }

    this.startApp.emit(app.id);
  }

  onLogout(): void {
    this.logout.emit();
  }

  onTurnOff(): void {
    this.turnOff.emit();
  }

  openAllPrograms(): void {
    this.isAllProgramsOpen = true;
  }

  closeAllPrograms(): void {
    this.isAllProgramsOpen = false;
  }

  resetStartMenu(): void {
    this.isAllProgramsOpen = false;
  }

  setLang(code: 'es' | 'en' | 'fr'): void {
    this.languageService.setLang(code);
    this.currentLang = code.toUpperCase();
  }

  openUrl(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  private updateTime(): void {
    const now = new Date();

    this.time = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
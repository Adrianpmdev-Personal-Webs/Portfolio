/**
 * Taskbar
 *
 * XP taskbar with the Start menu, language selector, window tabs and a clock
 * that updates on the minute.
 *
 * @author adrianpmdev
 */

import { TitleCasePipe } from '@angular/common';
import { Component, OnDestroy, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';
import { AppDefinition } from '../../apps/app-definition';
import { LanguageSettings } from '../../../core/i18n/language-settings';
import { DesktopWindow } from '../desktop-window';

@Component({
  selector: 'app-taskbar',
  imports: [MatButtonModule, MatMenuModule, TranslatePipe, TitleCasePipe],
  templateUrl: './taskbar.html',
  styleUrl: './taskbar.scss',
})
export class Taskbar implements OnDestroy {
  private readonly languageSettings = inject(LanguageSettings);

  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  readonly windows = input<DesktopWindow[]>([]);
  readonly apps = input<readonly AppDefinition[]>([]);
  readonly userName = input('');

  readonly windowTabClick = output<string>();
  readonly appLaunch = output<AppDefinition>();
  readonly logout = output<void>();
  readonly turnOff = output<void>();

  protected time = '';
  protected currentLang = this.languageSettings.getCurrentLang().toUpperCase();
  protected isAllProgramsOpen = false;

  constructor() {
    this.updateTime();

    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    this.timeoutId = setTimeout(() => {
      this.updateTime();
      this.intervalId = setInterval(() => this.updateTime(), 60_000);
      this.timeoutId = null;
    }, msToNextMinute);
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

  protected launchAppById(id: string): void {
    const app = this.apps().find((item) => item.id === id);
    if (app) this.appLaunch.emit(app);
  }

  protected openAllPrograms(): void {
    this.isAllProgramsOpen = true;
  }

  protected closeAllPrograms(): void {
    this.isAllProgramsOpen = false;
  }

  protected setLang(code: 'es' | 'en' | 'fr'): void {
    this.languageSettings.setLang(code);
    this.currentLang = code.toUpperCase();
  }

  protected openUrl(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  private updateTime(): void {
    this.time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });
  }
}

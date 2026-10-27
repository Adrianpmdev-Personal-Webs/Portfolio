/**
 * Taskbar
 *
 * XP taskbar with the Start button, window tabs, language selector and a
 * clock that updates on the minute.
 *
 * @author adrianpmdev
 */

import { UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';
import { Language, SUPPORTED_LANGUAGES } from '../../../core/i18n/language';
import { LanguageSettings } from '../../../core/i18n/language-settings';
import { AppDefinition } from '../../apps/app-definition';
import { DesktopWindow } from '../desktop-window';
import { StartMenu } from '../start-menu/start-menu';

@Component({
  selector: 'app-taskbar',
  imports: [MatButtonModule, MatMenuModule, TranslatePipe, UpperCasePipe, StartMenu],
  templateUrl: './taskbar.html',
  styleUrl: './taskbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Taskbar {
  private readonly languageSettings = inject(LanguageSettings);

  readonly windows = input<DesktopWindow[]>([]);
  readonly apps = input<readonly AppDefinition[]>([]);
  readonly userName = input('');

  readonly windowTabClick = output<string>();
  readonly appLaunch = output<AppDefinition>();
  readonly logout = output<void>();
  readonly turnOff = output<void>();

  protected readonly languages = SUPPORTED_LANGUAGES;
  protected readonly currentLang = this.languageSettings.currentLang;
  protected readonly time = signal(this.formatTime());

  constructor() {
    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      this.time.set(this.formatTime());
      intervalId = setInterval(() => this.time.set(this.formatTime()), 60_000);
    }, msToNextMinute);

    inject(DestroyRef).onDestroy(() => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    });
  }

  protected setLang(lang: Language): void {
    this.languageSettings.setLang(lang);
  }

  private formatTime(): string {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });
  }
}

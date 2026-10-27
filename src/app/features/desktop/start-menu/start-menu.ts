/**
 * StartMenu
 *
 * XP Start menu: user header, installed apps, the "All programs" shortcuts and
 * the log off / turn off buttons. Exposes its MatMenu so the taskbar's Start
 * button can open it.
 *
 * @author adrianpmdev
 */

import { TitleCasePipe } from '@angular/common';
import { Component, input, output, viewChild } from '@angular/core';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';
import { PROFILE } from '../../../shared/profile/profile-data';
import { AppDefinition } from '../../apps/app-definition';

@Component({
  selector: 'app-start-menu',
  imports: [MatMenuModule, TranslatePipe, TitleCasePipe],
  templateUrl: './start-menu.html',
  styleUrl: './start-menu.scss',
})
export class StartMenu {
  readonly menu = viewChild.required(MatMenu);

  readonly apps = input<readonly AppDefinition[]>([]);
  readonly userName = input('');

  readonly appLaunch = output<AppDefinition>();
  readonly logout = output<void>();
  readonly turnOff = output<void>();

  protected readonly profile = PROFILE;
  protected isAllProgramsOpen = false;

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

  protected openUrl(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

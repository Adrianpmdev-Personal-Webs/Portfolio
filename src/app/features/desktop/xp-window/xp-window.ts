/**
 * XpWindow
 *
 * XP window frame that renders its already-loaded app component, provides it
 * with the APP_WINDOW context and emits minimize/close clicks for the Desktop
 * to handle.
 *
 * @author adrianpmdev
 */

import { NgComponentOutlet } from '@angular/common';
import { Component, Injector, computed, inject, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { APP_WINDOW, AppWindow } from '../../apps/app-window';
import { DesktopWindow } from '../desktop-window';

@Component({
  selector: 'app-xp-window',
  imports: [NgComponentOutlet, TranslatePipe],
  templateUrl: './xp-window.html',
  styleUrl: './xp-window.scss',
  host: {
    '[attr.data-window-id]': 'desktopWindow().id',
    '[class.xp-window--active]': 'desktopWindow().active',
    '[style.z-index]': 'desktopWindow().zIndex',
  },
})
export class XpWindow {
  readonly desktopWindow = input.required<DesktopWindow>();

  readonly minimizeClick = output<void>();
  readonly closeClick = output<void>();

  protected readonly appInjector = Injector.create({
    parent: inject(Injector),
    providers: [
      {
        provide: APP_WINDOW,
        useValue: { active: computed(() => this.desktopWindow().active) } satisfies AppWindow,
      },
    ],
  });
}

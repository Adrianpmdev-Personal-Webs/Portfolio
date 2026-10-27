/**
 * XpWindow
 *
 * XP window frame that lazy-loads its app component and emits minimize/close
 * clicks for the Desktop to handle.
 *
 * @author adrianpmdev
 */

import { NgComponentOutlet } from '@angular/common';
import { Component, OnInit, Type, input, output, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
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
export class XpWindow implements OnInit {
  readonly desktopWindow = input.required<DesktopWindow>();

  readonly minimizeClick = output<void>();
  readonly closeClick = output<void>();

  protected readonly appComponent = signal<Type<unknown> | null>(null);

  ngOnInit(): void {
    this.desktopWindow()
      .app.loadComponent()
      .then((component) => this.appComponent.set(component));
  }
}

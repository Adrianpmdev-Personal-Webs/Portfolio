/**
 * App
 *
 * Root component. Initializes the active language; page cross-fades are
 * handled by the router through the View Transitions API.
 *
 * @author adrianpmdev
 */

import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageSettings } from './core/i18n/language-settings';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private readonly languageSettings = inject(LanguageSettings);

  ngOnInit(): void {
    this.languageSettings.initLang();
  }
}

/**
 * APP_WINDOW
 *
 * Context the desktop window provides to the app it hosts, so an app can
 * react to its own window state (for example, only handling keyboard shortcuts
 * while its window is the active one).
 *
 * @author adrianpmdev
 */

import { InjectionToken, Signal } from '@angular/core';

export interface AppWindow {
  readonly active: Signal<boolean>;
}

export const APP_WINDOW = new InjectionToken<AppWindow>('APP_WINDOW');

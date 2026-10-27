/**
 * DesktopWindow
 *
 * Window open on the desktop with its app component already loaded. Its id is
 * the app id, so there is at most one window per app.
 *
 * @author adrianpmdev
 */

import { Type } from '@angular/core';
import { AppDefinition } from '../apps/app-definition';

export type DesktopWindowState = 'open' | 'minimized';

export interface DesktopWindow {
  id: string;
  app: AppDefinition;
  component: Type<unknown>;
  state: DesktopWindowState;
  active: boolean;
  zIndex: number;
}

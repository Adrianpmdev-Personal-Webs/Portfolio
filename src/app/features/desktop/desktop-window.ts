/**
 * DesktopWindow
 *
 * Window open on the desktop. Its id is the app id, so there is at most one
 * window per app.
 *
 * @author adrianpmdev
 */

import { AppDefinition } from '../apps/app-definition';

export type DesktopWindowState = 'open' | 'minimized';

export interface DesktopWindow {
  id: string;
  app: AppDefinition;
  state: DesktopWindowState;
  active: boolean;
  zIndex: number;
}

/**
 * APP_REGISTRY
 *
 * Installed desktop apps, in display order. Adding a manifest here makes the
 * app appear on the desktop, Start menu and taskbar.
 *
 * @author adrianpmdev
 */

import { AppDefinition } from './app-definition';
import { INTERNET_EXPLORER_APP } from './internet-explorer/internet-explorer-manifest';
import { MINESWEEPER_APP } from './minesweeper/minesweeper-manifest';
import { MY_PC_APP } from './my-pc/my-pc-manifest';
import { PHOTO_VIEWER_APP } from './photo-viewer/photo-viewer-manifest';

export const APP_REGISTRY: readonly AppDefinition[] = [
  MY_PC_APP,
  INTERNET_EXPLORER_APP,
  PHOTO_VIEWER_APP,
  MINESWEEPER_APP,
];

/**
 * MINESWEEPER_APP
 *
 * Registry entry for the Minesweeper app.
 *
 * @author adrianpmdev
 */

import { AppDefinition } from '../app-definition';

export const MINESWEEPER_APP: AppDefinition = {
  id: 'minesweeper',
  titleKey: 'minesweeper.title',
  iconSrc: '/assets/images/system/apps/minesweeper.png',
  loadComponent: () => import('./minesweeper').then((m) => m.Minesweeper),
};

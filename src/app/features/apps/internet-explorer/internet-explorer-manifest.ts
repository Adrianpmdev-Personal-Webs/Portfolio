/**
 * INTERNET_EXPLORER_APP
 *
 * Registry entry for the Internet Explorer app.
 *
 * @author adrianpmdev
 */

import { AppDefinition } from '../app-definition';

export const INTERNET_EXPLORER_APP: AppDefinition = {
  id: 'internet-explorer',
  titleKey: 'internetExplorer.title',
  iconSrc: '/assets/images/system/apps/explorer.webp',
  loadComponent: () => import('./internet-explorer').then((m) => m.InternetExplorer),
};

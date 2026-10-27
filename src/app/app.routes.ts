/**
 * routes
 *
 * Application routes: boot → login → desktop (protected by desktopGuard).
 * Unknown paths redirect to the boot screen.
 *
 * @author adrianpmdev
 */

import { Routes } from '@angular/router';
import { desktopGuard } from './features/desktop/desktop-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/boot/boot').then((m) => m.Boot),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: 'desktop',
    canActivate: [desktopGuard],
    loadComponent: () => import('./features/desktop/desktop').then((m) => m.Desktop),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

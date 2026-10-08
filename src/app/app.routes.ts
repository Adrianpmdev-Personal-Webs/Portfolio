import { Routes } from '@angular/router';
import { desktopGuard } from './core/guards/desktop.guard';

/**
 * Rutas de la aplicación: boot → login → escritorio (protegido por
 * {@link desktopGuard}), con redirección a la pantalla de arranque para
 * cualquier ruta no reconocida.
 *
 * @author adrianpmdev
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/boot-screen/boot-screen.component').then((m) => m.BootScreenComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'desktop',
    canActivate: [desktopGuard],
    loadComponent: () => import('./pages/desktop/desktop.component').then(m => m.DesktopComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
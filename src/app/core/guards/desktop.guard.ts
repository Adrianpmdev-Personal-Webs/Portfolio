import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserSessionService } from '../services/user-session.service';
import { AccessLogService } from '../services/access-log.service';

/**
 * Protege la ruta `/desktop`: exige que haya un nombre de usuario guardado
 * en {@link UserSessionService} (redirige a `/login` si no lo hay) y, si el
 * acceso está permitido, registra el acceso con {@link AccessLogService}.
 *
 * @author adrianpmdev
 */
export const desktopGuard: CanActivateFn = () => {
  const session = inject(UserSessionService);
  const router = inject(Router);
  const accessLog = inject(AccessLogService);

  const userName = session.getUserName().trim();
  const allowed = Boolean(userName);
  if (!allowed) return router.createUrlTree(['/login']);

  accessLog.logDesktopAccess();

  return true;
};
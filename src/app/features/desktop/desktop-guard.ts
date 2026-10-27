/**
 * desktopGuard
 *
 * Allows /desktop only when a user name is stored (otherwise redirects to
 * /login) and logs the access.
 *
 * @author adrianpmdev
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccessLogger } from '../../core/analytics/access-logger';
import { UserSession } from '../../core/session/user-session';

export const desktopGuard: CanActivateFn = () => {
  const session = inject(UserSession);
  const router = inject(Router);
  const accessLogger = inject(AccessLogger);

  const userName = session.getUserName().trim();
  if (!userName) return router.createUrlTree(['/login']);

  accessLogger.logDesktopAccess();

  return true;
};

import { Injectable } from '@angular/core';

/**
 * Gestiona el nombre de usuario de la sesión "XP" (persistido en
 * `localStorage`), que actúa como indicador de sesión iniciada: si hay
 * nombre guardado, {@link desktopGuard} permite el acceso al escritorio.
 *
 * @author adrianpmdev
 */
@Injectable({ providedIn: 'root' })
export class UserSessionService {
  private readonly userNameKey = 'xp_user_name';

  setUserName(name: string): void {
    localStorage.setItem(this.userNameKey, name);
  }

  getUserName(): string {
    return localStorage.getItem(this.userNameKey) ?? '';
  }

  clearUserName(): void {
    localStorage.removeItem(this.userNameKey);
  }
}
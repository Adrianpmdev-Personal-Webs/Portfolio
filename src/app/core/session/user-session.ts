/**
 * UserSession
 *
 * Stores the session user name in localStorage; its presence means the user is
 * logged in.
 *
 * @author adrianpmdev
 */

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserSession {
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

/**
 * MyPc
 *
 * Personal profile app with contact details, stack, languages, career and
 * quick links (LinkedIn, email, CV).
 *
 * @author adrianpmdev
 */

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AccessLogger } from '../../../core/analytics/access-logger';
import { PROFILE } from '../../../shared/profile/profile-data';
import { SKILLS } from './skills-data';

@Component({
  selector: 'app-my-pc',
  imports: [TranslatePipe],
  templateUrl: './my-pc.html',
  styleUrl: './my-pc.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(keydown.escape)': 'closeMenu()',
  },
})
export class MyPc {
  private readonly accessLogger = inject(AccessLogger);

  protected readonly profile = PROFILE;
  protected readonly skills = SKILLS;
  protected readonly isMenuOpen = signal(false);

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected logCvDownload(): void {
    this.accessLogger.logCvDownload();
  }

  protected logLinkedinClick(): void {
    this.accessLogger.logLinkedinClick();
  }
}

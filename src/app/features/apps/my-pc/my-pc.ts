/**
 * MyPc
 *
 * Personal profile app with contact details, stack, languages, career and
 * quick links (LinkedIn, email, CV).
 *
 * @author adrianpmdev
 */

import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AccessLogger } from '../../../core/analytics/access-logger';
import { SKILLS } from './skills-data';

@Component({
  selector: 'app-my-pc',
  imports: [TranslatePipe],
  templateUrl: './my-pc.html',
  styleUrl: './my-pc.scss',
})
export class MyPc {
  private readonly accessLogger = inject(AccessLogger);

  protected readonly skills = SKILLS;
  protected isMenuOpen = false;

  protected toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  protected closeMenu(): void {
    this.isMenuOpen = false;
  }

  protected logCvDownload(): void {
    this.accessLogger.logCvDownload();
  }

  protected logLinkedinClick(): void {
    this.accessLogger.logLinkedinClick();
  }
}

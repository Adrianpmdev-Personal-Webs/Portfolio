/**
 * Login
 *
 * XP welcome screen route. Validates and stores the user name, then plays the
 * welcome animation before opening the desktop.
 *
 * @author adrianpmdev
 */

import { TitleCasePipe } from '@angular/common';
import { AfterViewInit, Component, DOCUMENT, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { gsap } from 'gsap';
import { UserSession } from '../../core/session/user-session';

type LoginState = 'form' | 'loading' | 'welcome';

@Component({
  selector: 'app-login',
  imports: [
    TitleCasePipe,
    ReactiveFormsModule,
    TranslatePipe,
    MatCardModule,
    MatProgressBarModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly userSession = inject(UserSession);
  private readonly document = inject(DOCUMENT);

  protected state: LoginState = 'form';
  protected displayName = '';

  protected readonly nameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(2), Validators.maxLength(24)],
  });

  ngAfterViewInit(): void {
    gsap
      .timeline()
      .from('.login-shell__left', { x: -24, opacity: 0, duration: 0.55, ease: 'power2.out' })
      .from('.login-card', { x: 24, opacity: 0, duration: 0.55, ease: 'power2.out' }, '-=0.4');
  }

  protected submitName(): void {
    if (this.state !== 'form') return;

    const normalizedName = this.normalizeName(this.nameControl.value);
    const validationError = this.getValidationError(normalizedName);

    if (validationError) {
      this.nameControl.setErrors(validationError);
      this.nameControl.markAsTouched();
      return;
    }

    this.displayName = normalizedName;
    this.userSession.setUserName(normalizedName);
    this.state = 'loading';

    gsap.to('.login-form-shell', { opacity: 0.5, duration: 0.2 });

    gsap.delayedCall(1, () => {
      this.state = 'welcome';

      setTimeout(() => {
        gsap
          .timeline({
            onComplete: () => {
              gsap.delayedCall(2, () => this.router.navigateByUrl('/desktop'));
            },
          })
          .to('.login-form-shell', {
            opacity: 0,
            y: -10,
            duration: 0.3,
            ease: 'power2.inOut',
          })
          .fromTo(
            '.welcome-shell',
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
          );
      }, 0);
    });
  }

  protected turnOff(): void {
    try {
      if (this.document.fullscreenElement) {
        this.document.exitFullscreen();
      }
    } catch {}

    this.router.navigateByUrl('/');
  }

  private normalizeName(value: string): string {
    return value.trim().replace(/\s+/g, ' ');
  }

  private getValidationError(name: string): { required?: true; minlength?: true } | null {
    if (!name) {
      return { required: true };
    }

    if (name.length < 2) {
      return { minlength: true };
    }

    return null;
  }
}

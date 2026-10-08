import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, AfterViewInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { gsap } from 'gsap';
import { UserSessionService } from '../../core/services/user-session.service';

type LoginState = 'form' | 'loading' | 'welcome';

/**
 * Página de login: recrea la pantalla de bienvenida de Windows XP. Pide un
 * nombre de usuario, lo valida y persiste, y encadena la animación de
 * bienvenida antes de navegar al escritorio.
 *
 * @author adrianpmdev
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly userSessionService = inject(UserSessionService);
  private readonly document = inject(DOCUMENT);

  state: LoginState = 'form';
  displayName = '';

  nameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(2), Validators.maxLength(24)],
  });

  ngAfterViewInit(): void {
    gsap
      .timeline()
      .from('.login-shell__left', { x: -24, opacity: 0, duration: 0.55, ease: 'power2.out' })
      .from('.login-card', { x: 24, opacity: 0, duration: 0.55, ease: 'power2.out' }, '-=0.4');
  }

  submitName(): void {
    if (this.state !== 'form') return;

    const normalizedName = this.normalizeName(this.nameControl.value);
    const validationError = this.getValidationError(normalizedName);

    if (validationError) {
      this.nameControl.setErrors(validationError);
      this.nameControl.markAsTouched();
      return;
    }

    this.displayName = normalizedName;
    this.userSessionService.setUserName(normalizedName);
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

  onTurnOff(): void {
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

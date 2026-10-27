/**
 * Boot
 *
 * XP-style boot screen route. Leads to the login, or straight to the desktop
 * when a session is already stored.
 *
 * @author adrianpmdev
 */

import { NgOptimizedImage } from '@angular/common';
import { Component, DestroyRef, ElementRef, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { gsap } from 'gsap';
import { TranslatePipe } from '@ngx-translate/core';
import { DeviceDetector } from '../../core/device/device-detector';
import { Fullscreen } from '../../core/fullscreen/fullscreen';
import { UserSession } from '../../core/session/user-session';

@Component({
  selector: 'app-boot',
  imports: [NgOptimizedImage, MatRippleModule, MatProgressBarModule, TranslatePipe],
  templateUrl: './boot.html',
  styleUrl: './boot.scss',
})
export class Boot implements OnInit {
  private readonly router = inject(Router);
  private readonly userSession = inject(UserSession);
  private readonly deviceDetector = inject(DeviceDetector);
  private readonly fullscreen = inject(Fullscreen);
  private readonly animations = gsap.context(() => {}, inject(ElementRef).nativeElement);

  protected booting = false;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.animations.kill());
  }

  ngOnInit(): void {
    this.animations.add(() => {
      gsap
        .timeline()
        .from('.boot-logo', { y: 26, opacity: 0, duration: 0.7, ease: 'power3.out' })
        .from('.boot-title', { y: 18, opacity: 0, duration: 0.55, ease: 'power2.out' }, '-=0.35')
        .from('.boot-hint', { opacity: 0, duration: 0.5, ease: 'sine.out' }, '-=0.25');
    });
  }

  protected enterLoginOrDesktop(): void {
    if (this.booting) return;
    if (this.deviceDetector.isDesktop()) this.fullscreen.enter();

    this.booting = true;
    const nextRoute = this.userSession.getUserName().trim() ? '/desktop' : '/login';

    this.animations.add(() => {
      gsap
        .timeline({ onComplete: () => this.router.navigateByUrl(nextRoute) })
        .to('.boot-hint', { opacity: 0, duration: 0.2 })
        .to(
          '.boot-content',
          { scale: 0.985, opacity: 0, filter: 'blur(2px)', duration: 0.45, ease: 'power2.inOut' },
          0,
        )
        .to('.xp-saver', { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, '>-0.08');
    });
  }
}

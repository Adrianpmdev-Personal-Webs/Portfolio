/**
 * Boot
 *
 * XP-style boot screen route. Leads to the login, or straight to the desktop
 * when a session is already stored.
 *
 * @author adrianpmdev
 */

import { Component, ElementRef, OnInit, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { gsap } from 'gsap';
import { TranslatePipe } from '@ngx-translate/core';
import { UserSession } from '../../core/session/user-session';

@Component({
  selector: 'app-boot',
  imports: [MatRippleModule, MatProgressBarModule, TranslatePipe],
  templateUrl: './boot.html',
  styleUrl: './boot.scss',
})
export class Boot implements OnInit {
  private readonly screenRef = viewChild.required<ElementRef<HTMLElement>>('screen');
  private readonly router = inject(Router);
  private readonly userSession = inject(UserSession);

  protected booting = false;

  ngOnInit(): void {
    const tl = gsap.timeline();
    tl.from('.boot-logo', {
      y: 26,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
    })
      .from(
        '.boot-title',
        {
          y: 18,
          opacity: 0,
          duration: 0.55,
          ease: 'power2.out',
        },
        '-=0.35'
      )
      .from(
        '.boot-hint',
        {
          opacity: 0,
          duration: 0.5,
          ease: 'sine.out',
        },
        '-=0.25'
      );
  }

  protected enterLoginOrDesktop(): void {
    if (this.booting) return;
    if (!this.isMobileOrTablet()) this.enterFullscreen();

    this.booting = true;

    const nextRoute = this.getNextRoute();

    const tl = gsap.timeline({
      onComplete: () => this.router.navigateByUrl(nextRoute),
    });

    tl.to('.boot-hint', {
      opacity: 0,
      duration: 0.2,
    })
      .to(
        '.boot-content',
        {
          scale: 0.985,
          opacity: 0,
          filter: 'blur(2px)',
          duration: 0.45,
          ease: 'power2.inOut',
        },
        0
      )
      .to(
        this.screenRef().nativeElement,
        {
          opacity: 0,
          duration: 0.35,
          ease: 'power2.inOut',
        },
        '>-0.08'
      );
  }

  private isMobileOrTablet(): boolean {
    return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
  }

  private enterFullscreen(): void {
    if (!document.fullscreenEnabled) return;
    document.documentElement.requestFullscreen().catch(() => {});
  }

  private getNextRoute(): string {
    const userName = this.userSession.getUserName().trim();
    return userName ? '/desktop' : '/login';
  }
}
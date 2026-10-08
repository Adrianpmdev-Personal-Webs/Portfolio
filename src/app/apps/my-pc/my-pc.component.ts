import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AccessLogService } from '../../core/services/access-log.service';

@Component({
  selector: 'app-my-pc',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './my-pc.component.html',
  styleUrl: './my-pc.component.scss',
})
export class MyPcComponent {
  private accessLog = inject(AccessLogService);

  isMenuOpen = false;

  skills = [
    {
      label: 'Spring Boot',
      url: 'https://docs.spring.io/spring-boot/docs/current/reference/html/',
    },
    {
      label: 'Java',
      url: 'https://docs.oracle.com/en/java/',
    },
    {
      label: 'SQL',
      url: 'https://www.postgresql.org/docs/current/sql.html',
    },
    {
      label: 'Android',
      url: 'https://developer.android.com/docs',
    },
    {
      label: 'Git',
      url: 'https://git-scm.com/doc',
    },
    {
      label: 'Docker',
      url: 'https://docs.docker.com/',
    },
    {
      label: 'Flutter',
      url: 'https://docs.flutter.dev',
    },
    {
      label: 'Angular',
      url: 'https://angular.io/docs',
    },
    {
      label: 'Supabase',
      url: 'https://supabase.com/docs',
    },
  ];

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  onCvDownload(): void {
    this.accessLog.logCvDownload();
  }

  onLinkedinClick(): void {
    this.accessLog.logLinkedinClick();
  }
}
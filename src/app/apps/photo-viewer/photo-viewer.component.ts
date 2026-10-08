import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MobileProject } from '../../core/models/mobile-project.model';
import { MobileShot } from '../../core/models/mobile-shot.model';
import { ProjectStatusLabelPipe } from '../../core/pipes/project-status-label.pipe';

/**
 * Aplicación "Visor de fotos": ventana del escritorio que muestra las
 * capturas de los proyectos móviles del portfolio, con navegación entre
 * proyectos, miniaturas, zoom y atajos de teclado.
 *
 * @author adrianpmdev
 */
@Component({
  selector: 'app-photo-viewer',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ProjectStatusLabelPipe],
  templateUrl: './photo-viewer.component.html',
  styleUrl: './photo-viewer.component.scss',
})
export class PhotoViewerComponent {
  isProjectsMenuOpen = false;

  projects: MobileProject[] = [
    {
      id: 'app-1',
      name: 'Spotify2',
      platform: 'Android',
      status: 'online',
      description: 'photoViewer.projects.spotify',
      shots: [
        {
          id: 'a1',
          titleKey: 'photoViewer.shots.home',
          src: '/assets/images/mobile/Spotify/Spotify1.jpg',
          width: 1080,
          height: 2340
        },
        {
          id: 'a2',
          titleKey: 'photoViewer.shots.songs',
          src: '/assets/images/mobile/Spotify/Spotify2.jpg',
          width: 1080,
          height: 2340
        },
        {
          id: 'a3',
          titleKey: 'photoViewer.shots.player',
          src: '/assets/images/mobile/Spotify/Spotify3.jpg',
          width: 1080,
          height: 2340
        },
        {
          id: 'a4',
          titleKey: 'photoViewer.shots.account',
          src: '/assets/images/mobile/Spotify/Spotify4.jpg',
          width: 1080,
          height: 2340
        },
        {
          id: 'a5',
          titleKey: 'photoViewer.shots.splash',
          src: '/assets/images/mobile/Spotify/Spotify5.jpg',
          width: 1080,
          height: 2340
        },
        {
          id: 'a6',
          titleKey: 'photoViewer.shots.register',
          src: '/assets/images/mobile/Spotify/Spotify6.jpg',
          width: 1080,
          height: 2340
        },
        {
          id: 'a7',
          titleKey: 'photoViewer.shots.login',
          src: '/assets/images/mobile/Spotify/Spotify7.jpg',
          width: 1080,
          height: 2340
        }
      ]
    },
    {
      id: 'app-2',
      name: 'Eventvs Mérida',
      platform: 'Android',
      status: 'online',
      description: 'photoViewer.projects.eventvs',
      shots: [
        {
          id: 'b1',
          titleKey: 'photoViewer.shots.splash',
          src: '/assets/images/mobile/Eventvs/Eventvs1.jpg',
          width: 1080,
          height: 2340
        },
        {
          id: 'b2',
          titleKey: 'photoViewer.shots.home',
          src: '/assets/images/mobile/Eventvs/Eventvs2.jpg',
          width: 1080,
          height: 2340
        },
        {
          id: 'b3',
          titleKey: 'photoViewer.shots.details',
          src: '/assets/images/mobile/Eventvs/Eventvs3.jpg',
          width: 1080,
          height: 2340
        },
        {
          id: 'b4',
          titleKey: 'photoViewer.shots.map',
          src: '/assets/images/mobile/Eventvs/Eventvs4.jpg',
          width: 1080,
          height: 2340
        },
        {
          id: 'b5',
          titleKey: 'photoViewer.shots.calendar',
          src: '/assets/images/mobile/Eventvs/Eventvs5.jpg',
          width: 1080,
          height: 2340
        },
        {
          id: 'b6',
          titleKey: 'photoViewer.shots.profile',
          src: '/assets/images/mobile/Eventvs/Eventvs6.jpg',
          width: 1080,
          height: 2340
        },
        {
          id: 'b7',
          titleKey: 'photoViewer.shots.account',
          src: '/assets/images/mobile/Eventvs/Eventvs7.jpg',
          width: 1080,
          height: 2340
        },
        {
          id: 'b8',
          titleKey: 'photoViewer.shots.events',
          src: '/assets/images/mobile/Eventvs/Eventvs8.jpg',
          width: 1080,
          height: 2340
        },
        {
          id: 'b9',
          titleKey: 'photoViewer.shots.login',
          src: '/assets/images/mobile/Eventvs/Eventvs9.jpg',
          width: 1080,
          height: 2340
        },
        {
          id: 'b10',
          titleKey: 'photoViewer.shots.register',
          src: '/assets/images/mobile/Eventvs/Eventvs10.jpg',
          width: 1080,
          height: 2340
        }
      ]
    }
  ];

  selectedProjectId = 'app-1';
  selectedShotIndex = 0;
  zoom = 1;

  get selectedProject(): MobileProject {
    return (
      this.projects.find(
        (project) => project.id === this.selectedProjectId
      ) ?? {
        id: '',
        name: '',
        platform: 'Android',
        status: 'wip',
        description: '',
        shots: [
          {
            id: '',
            titleKey: '',
            src: '/assets/previews/placeholder.webp',
            width: 0,
            height: 0
          }
        ]
      }
    );
  }

  get selectedShot(): MobileShot {
    return (
      this.selectedProject.shots[this.selectedShotIndex] ??
      this.selectedProject.shots[0]
    );
  }

  get statusText(): string {
    const total = this.selectedProject.shots.length;
    const current = this.selectedShotIndex + 1;

    return `${this.selectedProject.name} - ${current}/${total} - ${this.selectedShot.width}x${this.selectedShot.height} - ${Math.round(this.zoom * 100)}%`;
  }

  get zoomPercentage(): number {
    return Math.round(this.zoom * 100);
  }

  toggleProjectsMenu(): void {
    this.isProjectsMenuOpen = !this.isProjectsMenuOpen;
  }

  closeProjectsMenu(): void {
    this.isProjectsMenuOpen = false;
  }

  selectProject(projectId: string): void {
    if (this.selectedProjectId === projectId) {
      return;
    }

    this.selectedProjectId = projectId;
    this.selectedShotIndex = 0;
    this.zoom = 1;
    this.closeProjectsMenu();
  }

  selectShot(index: number): void {
    this.selectedShotIndex = index;
    this.zoom = 1;
  }

  prev(): void {
    const total = this.selectedProject.shots.length;

    this.selectedShotIndex =
      (this.selectedShotIndex - 1 + total) % total;

    this.zoom = 1;
  }

  next(): void {
    const total = this.selectedProject.shots.length;

    this.selectedShotIndex =
      (this.selectedShotIndex + 1) % total;

    this.zoom = 1;
  }

  zoomIn(): void {
    this.zoom = Math.min(2.5, this.zoom + 0.2);
  }

  zoomOut(): void {
    this.zoom = Math.max(0.8, this.zoom - 0.2);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.prev();
    }

    if (event.key === 'ArrowRight') {
      this.next();
    }

    if (event.key === '+' || event.key === '=') {
      this.zoomIn();
    }

    if (event.key === '-' || event.key === '_') {
      this.zoomOut();
    }
  }
}
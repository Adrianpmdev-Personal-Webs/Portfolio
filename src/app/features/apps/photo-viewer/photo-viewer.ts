/**
 * PhotoViewer
 *
 * Photo viewer app that shows mobile project screenshots, with thumbnails,
 * zoom and keyboard shortcuts.
 *
 * @author adrianpmdev
 */

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ProjectStatusLabelPipe } from '../../../shared/project-status/project-status-label-pipe';
import { APP_WINDOW } from '../app-window';
import { MOBILE_PROJECTS } from './mobile-projects-data';

const MIN_ZOOM = 0.8;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.2;

@Component({
  selector: 'app-photo-viewer',
  imports: [TranslatePipe, ProjectStatusLabelPipe],
  templateUrl: './photo-viewer.html',
  styleUrl: './photo-viewer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:keydown)': 'handleKeydown($event)',
    '(keydown.escape)': 'closeProjectsMenu()',
  },
})
export class PhotoViewer {
  private readonly appWindow = inject(APP_WINDOW, { optional: true });

  protected readonly projects = MOBILE_PROJECTS;

  protected readonly isProjectsMenuOpen = signal(false);
  protected readonly selectedProjectId = signal(this.projects[0].id);
  protected readonly selectedShotIndex = signal(0);
  protected readonly zoom = signal(1);

  protected readonly selectedProject = computed(
    () =>
      this.projects.find((project) => project.id === this.selectedProjectId()) ?? this.projects[0],
  );
  protected readonly selectedShot = computed(
    () => this.selectedProject().shots[this.selectedShotIndex()] ?? this.selectedProject().shots[0],
  );
  protected readonly zoomPercentage = computed(() => Math.round(this.zoom() * 100));

  protected toggleProjectsMenu(): void {
    this.isProjectsMenuOpen.update((open) => !open);
  }

  protected closeProjectsMenu(): void {
    this.isProjectsMenuOpen.set(false);
  }

  protected selectProject(projectId: string): void {
    if (this.selectedProjectId() === projectId) return;

    this.selectedProjectId.set(projectId);
    this.selectShot(0);
    this.closeProjectsMenu();
  }

  protected selectShot(index: number): void {
    this.selectedShotIndex.set(index);
    this.zoom.set(1);
  }

  protected prev(): void {
    const total = this.selectedProject().shots.length;
    this.selectShot((this.selectedShotIndex() - 1 + total) % total);
  }

  protected next(): void {
    const total = this.selectedProject().shots.length;
    this.selectShot((this.selectedShotIndex() + 1) % total);
  }

  protected zoomIn(): void {
    this.zoom.update((zoom) => Math.min(MAX_ZOOM, zoom + ZOOM_STEP));
  }

  protected zoomOut(): void {
    this.zoom.update((zoom) => Math.max(MIN_ZOOM, zoom - ZOOM_STEP));
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (this.appWindow && !this.appWindow.active()) return;

    switch (event.key) {
      case 'ArrowLeft':
        this.prev();
        break;
      case 'ArrowRight':
        this.next();
        break;
      case '+':
      case '=':
        this.zoomIn();
        break;
      case '-':
      case '_':
        this.zoomOut();
        break;
    }
  }
}

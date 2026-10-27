/**
 * PhotoViewer
 *
 * Photo viewer app that shows mobile project screenshots, with thumbnails,
 * zoom and keyboard shortcuts.
 *
 * @author adrianpmdev
 */

import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ProjectStatusLabelPipe } from '../../../shared/project-status/project-status-label-pipe';
import { APP_WINDOW } from '../app-window';
import { MobileProject } from './mobile-project';
import { MobileShot } from './mobile-shot';
import { MOBILE_PROJECTS } from './mobile-projects-data';

@Component({
  selector: 'app-photo-viewer',
  imports: [TranslatePipe, ProjectStatusLabelPipe],
  templateUrl: './photo-viewer.html',
  styleUrl: './photo-viewer.scss',
  host: {
    '(window:keydown)': 'handleKeydown($event)',
  },
})
export class PhotoViewer {
  private readonly appWindow = inject(APP_WINDOW, { optional: true });

  protected readonly projects = MOBILE_PROJECTS;

  protected isProjectsMenuOpen = false;
  protected selectedProjectId = this.projects[0].id;
  protected selectedShotIndex = 0;
  protected zoom = 1;

  protected get selectedProject(): MobileProject {
    return this.projects.find((project) => project.id === this.selectedProjectId) ?? this.projects[0];
  }

  protected get selectedShot(): MobileShot {
    return this.selectedProject.shots[this.selectedShotIndex] ?? this.selectedProject.shots[0];
  }

  protected get zoomPercentage(): number {
    return Math.round(this.zoom * 100);
  }

  protected toggleProjectsMenu(): void {
    this.isProjectsMenuOpen = !this.isProjectsMenuOpen;
  }

  protected closeProjectsMenu(): void {
    this.isProjectsMenuOpen = false;
  }

  protected selectProject(projectId: string): void {
    if (this.selectedProjectId === projectId) {
      return;
    }

    this.selectedProjectId = projectId;
    this.selectedShotIndex = 0;
    this.zoom = 1;
    this.closeProjectsMenu();
  }

  protected selectShot(index: number): void {
    this.selectedShotIndex = index;
    this.zoom = 1;
  }

  protected prev(): void {
    const total = this.selectedProject.shots.length;

    this.selectedShotIndex = (this.selectedShotIndex - 1 + total) % total;
    this.zoom = 1;
  }

  protected next(): void {
    const total = this.selectedProject.shots.length;

    this.selectedShotIndex = (this.selectedShotIndex + 1) % total;
    this.zoom = 1;
  }

  protected zoomIn(): void {
    this.zoom = Math.min(2.5, this.zoom + 0.2);
  }

  protected zoomOut(): void {
    this.zoom = Math.max(0.8, this.zoom - 0.2);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (this.appWindow && !this.appWindow.active()) return;

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

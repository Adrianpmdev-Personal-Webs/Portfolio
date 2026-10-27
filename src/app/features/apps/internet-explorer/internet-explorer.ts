/**
 * InternetExplorer
 *
 * Retro browser app that presents the web projects with an address bar, a
 * project list and a preview.
 *
 * @author adrianpmdev
 */

import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ProjectStatusLabelPipe } from '../../../shared/project-status/project-status-label-pipe';
import { WebProject } from './web-project';
import { WEB_PROJECTS } from './web-projects-data';

@Component({
  selector: 'app-internet-explorer',
  imports: [TranslatePipe, ProjectStatusLabelPipe],
  templateUrl: './internet-explorer.html',
  styleUrl: './internet-explorer.scss',
})
export class InternetExplorer {
  protected readonly projects = WEB_PROJECTS;

  protected isProjectsMenuOpen = false;
  protected selectedProjectId = this.projects[0].id;
  protected statusMessageKey = 'internetExplorer.status.ready';

  protected get selectedProject(): WebProject {
    return this.projects.find((p) => p.id === this.selectedProjectId) ?? this.projects[0];
  }

  private get selectedProjectIndex(): number {
    return this.projects.findIndex((project) => project.id === this.selectedProjectId);
  }

  protected get canGoBack(): boolean {
    return this.selectedProjectIndex > 0;
  }

  protected get canGoForward(): boolean {
    return this.selectedProjectIndex >= 0 && this.selectedProjectIndex < this.projects.length - 1;
  }

  protected toggleProjectsMenu(): void {
    this.isProjectsMenuOpen = !this.isProjectsMenuOpen;
  }

  protected closeProjectsMenu(): void {
    this.isProjectsMenuOpen = false;
  }

  protected selectProject(projectId: string): void {
    this.selectedProjectId = projectId;
    this.statusMessageKey = 'internetExplorer.status.projectSelected';
    this.closeProjectsMenu();
  }

  protected goBack(): void {
    if (!this.canGoBack) {
      return;
    }

    this.selectedProjectId = this.projects[this.selectedProjectIndex - 1].id;
    this.statusMessageKey = 'internetExplorer.status.projectSelected';
  }

  protected goForward(): void {
    if (!this.canGoForward) {
      return;
    }

    this.selectedProjectId = this.projects[this.selectedProjectIndex + 1].id;
    this.statusMessageKey = 'internetExplorer.status.projectSelected';
  }

  protected refreshProject(): void {
    this.statusMessageKey = 'internetExplorer.status.ready';
  }

  protected goHome(): void {
    this.selectedProjectId = this.projects[0].id;
    this.statusMessageKey = 'internetExplorer.status.ready';
  }

  protected showOpeningStatus(): void {
    this.statusMessageKey = 'internetExplorer.status.opening';
  }

  protected showOpenHint(): void {
    this.statusMessageKey = 'internetExplorer.status.hoverOpen';
  }

  protected showRepoHint(): void {
    this.statusMessageKey = 'internetExplorer.status.hoverRepo';
  }

  protected resetStatus(): void {
    this.statusMessageKey = 'internetExplorer.status.ready';
  }
}

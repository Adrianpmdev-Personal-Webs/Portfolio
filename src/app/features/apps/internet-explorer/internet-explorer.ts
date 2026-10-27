/**
 * InternetExplorer
 *
 * Retro browser app that presents the web projects with an address bar, a
 * project list and a preview.
 *
 * @author adrianpmdev
 */

import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ProjectStatusLabelPipe } from '../../../shared/project-status/project-status-label-pipe';
import { WEB_PROJECTS } from './web-projects-data';

@Component({
  selector: 'app-internet-explorer',
  imports: [TranslatePipe, ProjectStatusLabelPipe],
  templateUrl: './internet-explorer.html',
  styleUrl: './internet-explorer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(keydown.escape)': 'closeProjectsMenu()',
  },
})
export class InternetExplorer {
  protected readonly projects = WEB_PROJECTS;

  protected readonly isProjectsMenuOpen = signal(false);
  protected readonly selectedProjectId = signal(this.projects[0].id);
  protected readonly statusMessageKey = signal('internetExplorer.status.ready');

  private readonly selectedProjectIndex = computed(() =>
    this.projects.findIndex((project) => project.id === this.selectedProjectId()),
  );

  protected readonly selectedProject = computed(
    () => this.projects[this.selectedProjectIndex()] ?? this.projects[0],
  );
  protected readonly canGoBack = computed(() => this.selectedProjectIndex() > 0);
  protected readonly canGoForward = computed(
    () =>
      this.selectedProjectIndex() >= 0 && this.selectedProjectIndex() < this.projects.length - 1,
  );

  protected toggleProjectsMenu(): void {
    this.isProjectsMenuOpen.update((open) => !open);
  }

  protected closeProjectsMenu(): void {
    this.isProjectsMenuOpen.set(false);
  }

  protected selectProject(projectId: string): void {
    this.selectedProjectId.set(projectId);
    this.statusMessageKey.set('internetExplorer.status.projectSelected');
    this.closeProjectsMenu();
  }

  protected goBack(): void {
    if (!this.canGoBack()) return;
    this.selectProjectAt(this.selectedProjectIndex() - 1);
  }

  protected goForward(): void {
    if (!this.canGoForward()) return;
    this.selectProjectAt(this.selectedProjectIndex() + 1);
  }

  protected refreshProject(): void {
    this.resetStatus();
  }

  protected goHome(): void {
    this.selectedProjectId.set(this.projects[0].id);
    this.resetStatus();
  }

  protected showOpeningStatus(): void {
    this.statusMessageKey.set('internetExplorer.status.opening');
  }

  protected showOpenHint(): void {
    this.statusMessageKey.set('internetExplorer.status.hoverOpen');
  }

  protected showRepoHint(): void {
    this.statusMessageKey.set('internetExplorer.status.hoverRepo');
  }

  protected resetStatus(): void {
    this.statusMessageKey.set('internetExplorer.status.ready');
  }

  private selectProjectAt(index: number): void {
    this.selectedProjectId.set(this.projects[index].id);
    this.statusMessageKey.set('internetExplorer.status.projectSelected');
  }
}

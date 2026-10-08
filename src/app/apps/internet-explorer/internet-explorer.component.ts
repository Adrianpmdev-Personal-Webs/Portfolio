import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ExplorerProject } from '../../core/models/explorer-project.model';
import { ProjectStatusLabelPipe } from '../../core/pipes/project-status-label.pipe';

/**
 * Aplicación "Internet Explorer": ventana del escritorio que recrea un
 * navegador retro para presentar los proyectos web del portfolio, con
 * barra de direcciones, listado lateral y vista previa de cada proyecto.
 *
 * @author adrianpmdev
 */
@Component({
  selector: 'app-internet-explorer',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ProjectStatusLabelPipe],
  templateUrl: './internet-explorer.component.html',
  styleUrl: './internet-explorer.component.scss',
})
export class InternetExplorerComponent {
  isProjectsMenuOpen = false;

  projects: ExplorerProject[] = [
    {
      id: 'project1',
      titleKey: 'internetExplorer.projects.project1.title',
      summaryKey: 'internetExplorer.projects.project1.summary',
      status: 'online',
      deployUrl: 'https://the-witcher-web.vercel.app/',
      stack: ['HTML', 'CSS', 'JS'],
    },
    {
      id: 'project2',
      titleKey: 'internetExplorer.projects.project2.title',
      summaryKey: 'internetExplorer.projects.project2.summary',
      status: 'online',
      deployUrl: 'https://adrianpmdev-portfolio.vercel.app',
      stack: ['Angular', 'TypeScript', 'SCSS'],
    },
    {
      id: 'project3',
      titleKey: 'internetExplorer.projects.project3.title',
      summaryKey: 'internetExplorer.projects.project3.summary',
      status: 'online',
      deployUrl: 'https://eventvsmerida.vercel.app',
      stack: ['Angular', 'TypeScript', 'SCSS'],
    }
  ];

  selectedProjectId = 'project1';
  statusMessageKey = 'internetExplorer.status.ready';

  get selectedProject(): ExplorerProject {
    return (
      this.projects.find((p) => p.id === this.selectedProjectId) ?? {
        id: '',
        titleKey: '',
        summaryKey: '',
        status: 'wip',
        deployUrl: '',
        stack: [],
      }
    );
  }

  get selectedProjectIndex(): number {
    return this.projects.findIndex(
      (project) => project.id === this.selectedProjectId
    );
  }

  get canGoBack(): boolean {
    return this.selectedProjectIndex > 0;
  }

  get canGoForward(): boolean {
    return (
      this.selectedProjectIndex >= 0 &&
      this.selectedProjectIndex < this.projects.length - 1
    );
  }

  get selectedProjectPreviewPath(): string {
    return `/assets/images/webs/${this.selectedProject.id}.png`;
  }

  toggleProjectsMenu(): void {
    this.isProjectsMenuOpen = !this.isProjectsMenuOpen;
  }

  closeProjectsMenu(): void {
    this.isProjectsMenuOpen = false;
  }

  selectProject(projectId: string): void {
    this.selectedProjectId = projectId;
    this.statusMessageKey = 'internetExplorer.status.projectSelected';
    this.closeProjectsMenu();
  }

  goBack(): void {
    if (!this.canGoBack) {
      return;
    }

    this.selectedProjectId = this.projects[this.selectedProjectIndex - 1].id;
    this.statusMessageKey = 'internetExplorer.status.projectSelected';
  }

  goForward(): void {
    if (!this.canGoForward) {
      return;
    }

    this.selectedProjectId = this.projects[this.selectedProjectIndex + 1].id;
    this.statusMessageKey = 'internetExplorer.status.projectSelected';
  }

  refreshProject(): void {
    this.statusMessageKey = 'internetExplorer.status.ready';
  }

  goHome(): void {
    this.selectedProjectId = this.projects[0]?.id ?? '';
    this.statusMessageKey = 'internetExplorer.status.ready';
  }

  onOpenLink(): void {
    this.statusMessageKey = 'internetExplorer.status.opening';
  }

  onHoverOpen(): void {
    this.statusMessageKey = 'internetExplorer.status.hoverOpen';
  }

  onHoverRepo(): void {
    this.statusMessageKey = 'internetExplorer.status.hoverRepo';
  }

  onLeaveAction(): void {
    this.statusMessageKey = 'internetExplorer.status.ready';
  }
}
import { ProjectStatus } from './project-status.model';

/**
 * Proyecto web mostrado en la app Internet Explorer.
 *
 * @author adrianpmdev
 */
export interface ExplorerProject {
  id: string;
  titleKey: string;
  summaryKey: string;
  status: ProjectStatus;
  deployUrl: string;
  repoUrl?: string;
  stack: string[];
}
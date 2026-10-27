/**
 * WebProject
 *
 * Web project shown in Internet Explorer.
 *
 * @author adrianpmdev
 */

import { ProjectStatus } from '../../../shared/project-status/project-status';

export interface WebProject {
  id: string;
  titleKey: string;
  summaryKey: string;
  status: ProjectStatus;
  deployUrl: string;
  previewSrc: string;
  repoUrl?: string;
  stack: string[];
}

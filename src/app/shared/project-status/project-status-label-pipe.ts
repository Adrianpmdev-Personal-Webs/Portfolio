/**
 * ProjectStatusLabelPipe
 *
 * Maps a ProjectStatus to its i18n label key.
 *
 * @author adrianpmdev
 */

import { Pipe, PipeTransform } from '@angular/core';
import { ProjectStatus } from './project-status';

@Pipe({
  name: 'projectStatusLabel',
})
export class ProjectStatusLabelPipe implements PipeTransform {
  private readonly statusLabelKey: Record<ProjectStatus, string> = {
    online: 'common.projectStatus.online',
    wip: 'common.projectStatus.wip',
  };

  transform(status: ProjectStatus): string {
    return this.statusLabelKey[status];
  }
}
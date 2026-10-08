import { Pipe, PipeTransform } from '@angular/core';
import { ProjectStatus } from '../models/project-status.model';

/**
 * Traduce el estado interno de un proyecto (`online`/`wip`) a su clave de
 * i18n correspondiente, para mostrarlo como etiqueta en Internet Explorer
 * y en el Visor de fotos.
 *
 * @author adrianpmdev
 */
@Pipe({
  name: 'projectStatusLabel',
  standalone: true,
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
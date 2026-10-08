import { ProjectStatus } from './project-status.model';
import { MobileShot } from './mobile-shot.model';

/**
 * Proyecto móvil (Android/iOS) mostrado en la app Visor de fotos, junto
 * con sus capturas de pantalla asociadas.
 *
 * @author adrianpmdev
 */
export interface MobileProject {
  id: string;
  name: string;
  platform: 'Android' | 'iOS';
  status: ProjectStatus;
  description: string;
  shots: MobileShot[];
}
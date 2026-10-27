/**
 * MobileProject
 *
 * Mobile project (Android/iOS) shown in the Photo Viewer, with its
 * screenshots.
 *
 * @author adrianpmdev
 */

import { ProjectStatus } from '../../../shared/project-status/project-status';
import { MobileShot } from './mobile-shot';

export interface MobileProject {
  id: string;
  name: string;
  platform: 'Android' | 'iOS';
  status: ProjectStatus;
  description: string;
  shots: MobileShot[];
}

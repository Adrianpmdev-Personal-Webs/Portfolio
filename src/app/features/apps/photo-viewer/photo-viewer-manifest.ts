/**
 * PHOTO_VIEWER_APP
 *
 * Registry entry for the Photo Viewer app.
 *
 * @author adrianpmdev
 */

import { AppDefinition } from '../app-definition';

export const PHOTO_VIEWER_APP: AppDefinition = {
  id: 'photo-viewer',
  titleKey: 'photoViewer.title',
  iconSrc: '/assets/images/system/apps/photo_viewer.webp',
  loadComponent: () => import('./photo-viewer').then((m) => m.PhotoViewer),
};

/**
 * MY_PC_APP
 *
 * Registry entry for the My PC app.
 *
 * @author adrianpmdev
 */

import { AppDefinition } from '../app-definition';

export const MY_PC_APP: AppDefinition = {
  id: 'my-pc',
  titleKey: 'myPc.title',
  iconSrc: '/assets/images/system/apps/my_pc.png',
  loadComponent: () => import('./my-pc').then((m) => m.MyPc),
};

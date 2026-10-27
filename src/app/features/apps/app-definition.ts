/**
 * AppDefinition
 *
 * Contract every desktop app implements: id, title, icon and a lazy loader for
 * its component.
 *
 * @author adrianpmdev
 */

import { Type } from '@angular/core';

export interface AppDefinition {
  id: string;
  titleKey: string;
  iconSrc: string;
  loadComponent: () => Promise<Type<unknown>>;
}

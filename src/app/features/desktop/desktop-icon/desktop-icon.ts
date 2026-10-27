/**
 * DesktopIcon
 *
 * Presentational desktop icon that emits activate when clicked.
 *
 * @author adrianpmdev
 */

import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-desktop-icon',
  templateUrl: './desktop-icon.html',
  styleUrl: './desktop-icon.scss',
})
export class DesktopIcon {
  readonly label = input('');
  readonly iconSrc = input<string>();

  readonly activate = output<void>();
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Icono individual del escritorio. Es un componente "tonto": solo muestra
 * la etiqueta/icono recibidos y emite `select` al activarse; es el
 * contenedor (p. ej. {@link DesktopComponent}) quien decide qué hacer
 * (abrir una ventana, navegar, etc.).
 *
 * @author adrianpmdev
 */
@Component({
  selector: 'app-desktop-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './desktop-icon.component.html',
  styleUrl: './desktop-icon.component.scss',
})
export class DesktopIconComponent {
  @Input() label = '';
  @Input() iconSrc?: string;
  @Output() select = new EventEmitter<void>();

  onActivate(): void {
    this.select.emit();
  }
}

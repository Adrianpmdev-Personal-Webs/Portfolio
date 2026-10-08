import { OpenWindowConfig } from './open-window-config.model';

/** Estado en el que puede encontrarse una ventana del escritorio. */
export type DesktopWindowState = 'open' | 'minimized';

/**
 * Ventana de escritorio activa, gestionada por {@link WindowManagerService}.
 * Extiende la configuración con la que se abrió (título, icono, tipo de app)
 * añadiendo el estado propio de una ventana en tiempo de ejecución.
 *
 * @author adrianpmdev
 */
export interface DesktopWindow extends OpenWindowConfig {
  state: DesktopWindowState;
  active: boolean;
  zIndex: number;
}

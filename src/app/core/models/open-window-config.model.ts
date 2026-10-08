/**
 * Datos mínimos necesarios para abrir una ventana de escritorio: qué app
 * mostrar, con qué título/icono y de qué tipo es.
 *
 * @author adrianpmdev
 */
export interface OpenWindowConfig {
  id: string;
  titleKey: string;
  iconSrc?: string;
  content?: string;
  appType?: string;
}
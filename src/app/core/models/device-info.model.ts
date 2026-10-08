/**
 * Categoría general del dispositivo, según sus características de
 * puntero/pantalla.
 */
export type DeviceCategory = 'movil' | 'tablet' | 'ordenador';

/**
 * Plataforma/SO concreto del dispositivo.
 */
export type DevicePlatform =
  | 'iPhone'
  | 'iPad'
  | 'Android'
  | 'Windows'
  | 'macOS'
  | 'Linux'
  | 'ChromeOS'
  | 'Desconocido';

/**
 * Tipo de evento registrado.
 */
export type LogEventType = 'desktop' | 'cv' | 'linkedin';

/**
 * Información recogida en el cliente sobre un evento registrado.
 */
export interface AccessInfo {
  event: LogEventType;
  userName: string;
  device: DeviceCategory;
  platform: DevicePlatform;
  lang: string;
}

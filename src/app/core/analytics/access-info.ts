/**
 * AccessInfo
 *
 * Event types and device data sent to the logging endpoint.
 *
 * @author adrianpmdev
 */

export type DeviceCategory = 'movil' | 'tablet' | 'ordenador';

export type DevicePlatform =
  | 'iPhone'
  | 'iPad'
  | 'Android'
  | 'Windows'
  | 'macOS'
  | 'Linux'
  | 'ChromeOS'
  | 'Desconocido';

export type LogEventType = 'desktop' | 'cv' | 'linkedin';

export interface AccessInfo {
  event: LogEventType;
  userName: string;
  device: DeviceCategory;
  platform: DevicePlatform;
  lang: string;
}

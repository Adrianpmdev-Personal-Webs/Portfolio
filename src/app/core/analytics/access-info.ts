/**
 * AccessInfo
 *
 * Event types and device data sent to the logging endpoint.
 *
 * @author adrianpmdev
 */

import { DeviceCategory, DevicePlatform } from '../device/device';
import { Language } from '../i18n/language';

export type LogEventType = 'desktop' | 'cv' | 'linkedin';

export interface AccessInfo {
  event: LogEventType;
  userName: string;
  device: DeviceCategory;
  platform: DevicePlatform;
  lang: Language;
}

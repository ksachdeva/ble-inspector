import { IDeviceInfo } from './../plugin';

export interface IDeviceState {
  deviceInfo: IDeviceInfo;
  connecting: boolean;
  connected: boolean;
}

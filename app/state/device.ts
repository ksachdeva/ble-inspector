import { IDeviceInfo, IService } from './../plugin';

export interface IDeviceState {
  deviceInfo: IDeviceInfo;
  connecting: boolean;
  connected: boolean;
  discoveringServices: boolean;
  services: Array<IService>;
}

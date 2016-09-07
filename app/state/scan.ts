import { IDeviceInfo } from './../plugin';

export interface IScanState {
  scanning: boolean;
  permission: boolean;
  devices: Array<IDeviceInfo>;
}

import { IScanState } from './scan';
import { IDeviceState } from './device';

export interface IAppState {
  scan: IScanState;
  device: IDeviceState;
}

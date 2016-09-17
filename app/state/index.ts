import { BluetoothState } from './../enums';
import { IDeviceState } from './device';

export * from './device';

export interface IAppState {
  device: IDeviceState;
}

export const INITIAL_DEVICE_STATE: IDeviceState = {
  bleState: BluetoothState.Unknown,
  deviceInfo: null,
  connected: false,
  connecting: false,
  discoveringServices: false,
  discoveringChars: false,
  services: [],
  chars: [],
  scanning: false,
  permission: false,
  devices: []
};

export const INITIAL_APP_STATE: IAppState = {
  device: INITIAL_DEVICE_STATE
};

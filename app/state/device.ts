import { BluetoothState } from './../enums';
import { IDeviceInfo, IService, ICharacteristic } from './../plugin';

export interface ICharacteristicState {
  characteristic: ICharacteristic;
  transactionId: string;
}

export interface IDeviceState {
  bleState: BluetoothState;
  deviceInfo: IDeviceInfo;
  connecting: boolean;
  connected: boolean;
  discoveringServices: boolean;
  discoveringChars: boolean;
  services: Array<IService>;
  chars: Array<ICharacteristicState>;
}

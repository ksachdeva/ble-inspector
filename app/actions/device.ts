import { Injectable } from '@angular/core';
import { IDeviceInfo, IService, ICharacteristic } from './../plugin';

@Injectable()
export class DeviceActions {

  static CONNECT_TO_DEVICE = 'Connect to Device';
  static CONNECTION_TO_DEVICE_FAILED = 'Connection to Device failed';
  static CONNECTED_TO_DEVICE = 'Connected to Device';

  static DISCONNECT_DEVICE = 'Disconnect Device';

  static MONITOR_DEVICE_DISCONNECT = 'Monitor device disconnect';
  static DEVICE_DISCONNECTED = 'Device Disconnected';

  static START_SERVICE_DISCOVERY = 'Start Service discovery';
  static SERVICES_DISCOVERED = 'Services Discovered';

  static START_CHARACTERISTICS_DISCOVERY = 'Start characteristics discovery';
  static CHARACTERISTICS_DISCOVERED = 'Characterisitics Discovered';

  discoverCharacterisitics(payload: IService) {
    return {
      type: DeviceActions.START_CHARACTERISTICS_DISCOVERY,
      payload
    };
  }

  discoveredCharacteristics(payload: Array<ICharacteristic>) {
    return {
      type: DeviceActions.CHARACTERISTICS_DISCOVERED,
      payload
    };
  }

  discoverServices(payload: IDeviceInfo) {
    return {
      type: DeviceActions.START_SERVICE_DISCOVERY,
      payload
    };
  }

  discoveredServices(payload: Array<IService>) {
    return {
      type: DeviceActions.SERVICES_DISCOVERED,
      payload
    };
  }

  monitorDeviceDisconnect() {
    return {
      type: DeviceActions.MONITOR_DEVICE_DISCONNECT
    };
  }

  deviceDisconnected(payload: IDeviceInfo) {
    return {
      type: DeviceActions.DEVICE_DISCONNECTED,
      payload
    };
  }

  disconnectDevice(payload: IDeviceInfo) {
    return {
      type: DeviceActions.DISCONNECT_DEVICE,
      payload
    };
  }

  connectToDevice(payload: IDeviceInfo) {
    return {
      type: DeviceActions.CONNECT_TO_DEVICE,
      payload
    };
  }

  connectedToDevice(payload: IDeviceInfo) {
    return {
      type: DeviceActions.CONNECTED_TO_DEVICE,
      payload
    };
  }

  failedToConnectDevice(device: IDeviceInfo, error: any) {
    return {
      type: DeviceActions.CONNECTION_TO_DEVICE_FAILED,
      payload: {
        device,
        error
      }
    };
  }
}

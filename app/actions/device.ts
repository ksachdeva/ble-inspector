import { Injectable } from '@angular/core';
import { IDeviceInfo } from './../plugin';

@Injectable()
export class DeviceActions {

  static CONNECT_TO_DEVICE = 'Connect to Device';
  static CONNECTION_TO_DEVICE_FAILED = 'Connection to Device failed';
  static CONNECTED_TO_DEVICE = 'Connected to Device';

  static DISCONNECT_DEVICE = 'Disconnect Device';

  static MONITOR_DEVICE_DISCONNECT = 'Monitor device disconnect';
  static DEVICE_DISCONNECTED = 'Device Disconnected';

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

  failedToConnectDevice(payload: IDeviceInfo) {
    return {
      type: DeviceActions.CONNECTION_TO_DEVICE_FAILED,
      payload
    };
  }
}

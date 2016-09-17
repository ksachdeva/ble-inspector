import { Injectable } from '@angular/core';

import { Action } from './index';
import { BluetoothState } from './../enums';
import { ICharacteristicState } from './../state';
import { IDeviceInfo, IService, ICharacteristic } from './../plugin';

@Injectable()
export class DeviceActions {

  static PERMISSION_REQUEST = 'Request Permission';
  static PERMISSION_GRANTED = 'Permission Granted';
  static PERMISSION_DENIED = 'Permission Denied';

  static START_SCAN = 'Start Scan';
  static STARTED_SCAN = 'Started Scan';
  static START_SCAN_FAILED = 'Start Scan Failed';

  static STOP_SCAN = 'Stop Scan';
  static STOPPED_SCAN = 'Stopped Scan';
  static STOP_SCAN_FAILED = 'Stop Scan Failed';

  static ADD_DEVICE_INFO = 'Add Device Info';

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

  static START_CHARACTERISTIC_MONITORING = 'Start characteristics monitoring';
  static STOP_CHARACTERISTIC_MONITORING = 'Stop characteristics monitoring';
  static STOPPED_CHARACTERISTIC_MONITORING = 'Stopped characteristics monitoring';

  static START_READING_CHARACTERISITIC = 'Start reading characteristic';
  static READ_CHARACTERISITC = 'Read characteristic';

  static START_WRITING_CHARACTERISITIC = 'Start writing characteristic';
  static WROTE_CHRACTERISTIC = 'Wrote characteristic';

  static BLE_ERROR = 'Ble error';

  static START_STATE_MONITOR = 'Start state monitoring';
  static GET_CURRENT_STATE = 'Get current state';
  static BLE_STATE_CHANGE = 'Bluetooth state changed';

  addDeviceInfo(payload: IDeviceInfo): Action {
    return {
      type: DeviceActions.ADD_DEVICE_INFO,
      payload
    };
  }

  requestPermission(): Action {
    return {
      type: DeviceActions.PERMISSION_REQUEST
    };
  }

  permissionGranted(): Action {
    return {
      type: DeviceActions.PERMISSION_GRANTED
    };
  }

  permissionDenied(): Action {
    return {
      type: DeviceActions.PERMISSION_DENIED
    };
  }

  startScan(): Action {
    return {
      type: DeviceActions.START_SCAN
    };
  }

  startedScan(): Action {
    return {
      type: DeviceActions.STARTED_SCAN
    };
  }

  stopScan(): Action {
    return {
      type: DeviceActions.STOP_SCAN
    };
  }

  stoppedScan(): Action {
    return {
      type: DeviceActions.STOPPED_SCAN
    };
  }

  getCurrentState(): Action {
    return {
      type: DeviceActions.GET_CURRENT_STATE
    };
  }

  startStateMonitoring(): Action {
    return {
      type: DeviceActions.START_STATE_MONITOR
    };
  }

  bleStateChanged(payload: BluetoothState): Action {
    return {
      type: DeviceActions.BLE_STATE_CHANGE,
      payload
    };
  }

  bleError(payload: any): Action {
    return {
      type: DeviceActions.BLE_ERROR,
      payload
    };
  }

  startWritingCharacteristic(payload: ICharacteristicState, value: string, withResponse: boolean): Action {
    return {
      type: DeviceActions.START_WRITING_CHARACTERISITIC,
      payload: {
        charState: payload,
        value: value,
        withResponse: withResponse
      }
    };
  }

  wroteCharacteristic(payload: ICharacteristic): Action {
    return {
      type: DeviceActions.WROTE_CHRACTERISTIC,
      payload
    };
  }

  startReadingCharacteristic(payload: ICharacteristicState): Action {
    return {
      type: DeviceActions.START_READING_CHARACTERISITIC,
      payload
    };
  }

  readCharacteristic(payload: ICharacteristic): Action {
    return {
      type: DeviceActions.READ_CHARACTERISITC,
      payload
    };
  }

  startCharacteristicMonitoring(payload: ICharacteristicState): Action {
    return {
      type: DeviceActions.START_CHARACTERISTIC_MONITORING,
      payload
    };
  }

  stopCharacteristicMonitoring(payload: ICharacteristicState): Action {
    return {
      type: DeviceActions.STOP_CHARACTERISTIC_MONITORING,
      payload
    };
  }

  stoppedCharacteristicMonitoring(payload: ICharacteristicState) {
    return {
      type: DeviceActions.STOPPED_CHARACTERISTIC_MONITORING,
      payload
    };
  }

  discoverCharacterisitics(payload: IService): Action {
    return {
      type: DeviceActions.START_CHARACTERISTICS_DISCOVERY,
      payload
    };
  }

  discoveredCharacteristics(payload: Array<ICharacteristic>): Action {
    return {
      type: DeviceActions.CHARACTERISTICS_DISCOVERED,
      payload
    };
  }

  discoverServices(payload: IDeviceInfo): Action {
    return {
      type: DeviceActions.START_SERVICE_DISCOVERY,
      payload
    };
  }

  discoveredServices(payload: Array<IService>): Action {
    return {
      type: DeviceActions.SERVICES_DISCOVERED,
      payload
    };
  }

  monitorDeviceDisconnect(): Action {
    return {
      type: DeviceActions.MONITOR_DEVICE_DISCONNECT
    };
  }

  deviceDisconnected(payload: IDeviceInfo): Action {
    return {
      type: DeviceActions.DEVICE_DISCONNECTED,
      payload
    };
  }

  disconnectDevice(payload: IDeviceInfo): Action {
    return {
      type: DeviceActions.DISCONNECT_DEVICE,
      payload
    };
  }

  connectToDevice(payload: IDeviceInfo): Action {
    return {
      type: DeviceActions.CONNECT_TO_DEVICE,
      payload
    };
  }

  connectedToDevice(payload: IDeviceInfo): Action {
    return {
      type: DeviceActions.CONNECTED_TO_DEVICE,
      payload
    };
  }

  failedToConnectDevice(device: IDeviceInfo, error: any): Action {
    return {
      type: DeviceActions.CONNECTION_TO_DEVICE_FAILED,
      payload: {
        device,
        error
      }
    };
  }
}

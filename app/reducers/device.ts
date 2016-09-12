import * as _ from 'lodash';
import { Action } from '@ngrx/store';

import { BluetoothState } from './../enums';
import { IDeviceInfo, IService, ICharacteristic } from './../plugin';
import { IDeviceState, ICharacteristicState } from './../state/device';
import { DeviceActions } from './../actions/device';

const initialState: IDeviceState = {
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

function startScan(state = initialState) {
  return Object.assign({}, state, {
    scanning: true
  });
}

function stopScan(state = initialState) {
  return Object.assign({}, state, {
    scanning: false
  });
}

function updatePermission(state = initialState, granted: boolean) {
  return Object.assign({}, state, {
    permission: granted
  });
}

function addDeviceInfo(state = initialState, payload: IDeviceInfo) {
  // if we have the device then we simply update it
  // else we push it in the array
  const device = _.find(state.devices, (d) => d.uuid === payload.uuid);
  if (device === undefined) {
    return Object.assign({}, state, {
      devices: [
        ...state.devices,
        payload
      ]
    });
  } else {
    device.rssi = payload.rssi;
    return state;
  }
}

function connectedToDevice(state = initialState, payload: IDeviceInfo) {
  return Object.assign({}, state, {
    connected: true,
    connecting: false,
    deviceInfo: payload
  });
}

function connectToDevice(state = initialState, payload: IDeviceInfo) {
  return Object.assign({}, state, {
    connecting: true,
    deviceInfo: payload
  });
}

function disconnectedDevice(state = initialState) {
  return Object.assign({}, state, {
    connecting: false,
    connected: false
  });
}

function startDiscoveryService(state = initialState) {
  return Object.assign({}, state, {
    discoveringServices: true
  });
}

function servicesDiscovered(state = initialState, payload: Array<IService>) {
  return Object.assign({}, state, {
    discoveringServices: false,
    services: payload
  });
}

function charsDiscovered(state = initialState, payload: Array<ICharacteristic>) {
  const charsState: Array<ICharacteristicState> = _.map(payload, (p) => ({ characteristic: p, transactionId: null }));
  return Object.assign({}, state, {
    discoveringChars: false,
    chars: charsState
  });
}

function startCharacteristicMonitoring(state = initialState, payload: ICharacteristicState) {
  const readChar = _.find(state.chars, (c) => c.characteristic.uuid === payload.characteristic.uuid);
  readChar.transactionId = '2132';
  return state;
}

function stoppedCharacteristicMonitoring(state = initialState, payload: ICharacteristicState) {
  const readChar = _.find(state.chars, (c) => c.characteristic.uuid === payload.characteristic.uuid);
  readChar.transactionId = null;
  return state;
}

function readCharacterisitic(state = initialState, payload: ICharacteristic) {
  // find the char that we have read and replace its values
  // mutation ??
  const readChar = _.find(state.chars, (c) => c.characteristic.uuid === payload.uuid);
  readChar.characteristic.value = payload.value;
  return state;
}

function bleStateChange(state = initialState, payload: BluetoothState) {
  return Object.assign({}, state, {
    bleState: payload
  });
}

export default function(state = initialState, action: Action): IDeviceState {
  switch (action.type) {
    case DeviceActions.PERMISSION_GRANTED:
      return updatePermission(state, true);
    case DeviceActions.PERMISSION_DENIED:
      return updatePermission(state, false);
    case DeviceActions.START_SCAN:
      return startScan(state);
    case DeviceActions.STOP_SCAN:
      return stopScan(state);
    case DeviceActions.ADD_DEVICE_INFO:
      return addDeviceInfo(state, action.payload);
    case DeviceActions.BLE_STATE_CHANGE:
      return bleStateChange(state, action.payload);
    case DeviceActions.CONNECT_TO_DEVICE:
      return connectToDevice(state, action.payload);
    case DeviceActions.CONNECTED_TO_DEVICE:
      return connectedToDevice(state, action.payload);
    case DeviceActions.DEVICE_DISCONNECTED:
      return disconnectedDevice(state);
    case DeviceActions.START_SERVICE_DISCOVERY:
      return startDiscoveryService(state);
    case DeviceActions.SERVICES_DISCOVERED:
      return servicesDiscovered(state, action.payload);
    case DeviceActions.CHARACTERISTICS_DISCOVERED:
      return charsDiscovered(state, action.payload);
    case DeviceActions.START_CHARACTERISTIC_MONITORING:
    case DeviceActions.START_READING_CHARACTERISITIC:
      return startCharacteristicMonitoring(state, action.payload);
    case DeviceActions.STOPPED_CHARACTERISTIC_MONITORING:
      return stoppedCharacteristicMonitoring(state, action.payload);
    case DeviceActions.READ_CHARACTERISITC:
      return readCharacterisitic(state, action.payload);
    default:
      return state;
  }
}

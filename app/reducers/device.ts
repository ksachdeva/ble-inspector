import * as _ from 'lodash';
import { Action } from '@ngrx/store';

import { IDeviceInfo, IService, ICharacteristic } from './../plugin';
import { IDeviceState, ICharacteristicState } from './../state/device';
import { DeviceActions } from './../actions/device';

const initialState: IDeviceState = {
  deviceInfo: null,
  connected: false,
  connecting: false,
  discoveringServices: false,
  discoveringChars: false,
  services: [],
  chars: []
};

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

export default function(state = initialState, action: Action): IDeviceState {
  switch (action.type) {
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

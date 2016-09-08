import * as _ from 'lodash';
import { Action } from '@ngrx/store';

import { IDeviceInfo, IService } from './../plugin';
import { IDeviceState } from './../state/device';
import { DeviceActions } from './../actions/device';

const initialState: IDeviceState = {
  deviceInfo: null,
  connected: false,
  connecting: false,
  discoveringServices: false,
  services: []
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
    discoveredServices: false,
    services: payload
  });
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
    default:
      return state;
  }
}

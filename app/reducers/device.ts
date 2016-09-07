import * as _ from 'lodash';
import { Action } from '@ngrx/store';

import { IDeviceInfo } from './../plugin';
import { IDeviceState } from './../state/device';
import { DeviceActions } from './../actions/device';

const initialState: IDeviceState = {
  deviceInfo: null,
  connected: false,
  connecting: false
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

export default function(state = initialState, action: Action): IDeviceState {
  switch (action.type) {
    case DeviceActions.CONNECT_TO_DEVICE:
      return connectToDevice(state, action.payload);
    case DeviceActions.CONNECTED_TO_DEVICE:
      return connectedToDevice(state, action.payload);
    case DeviceActions.DEVICE_DISCONNECTED:
      return disconnectedDevice(state);
    default:
      return state;
  }
}

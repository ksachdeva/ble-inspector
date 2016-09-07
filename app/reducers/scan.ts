import * as _ from 'lodash';
import { Action } from '@ngrx/store';

import { IDeviceInfo } from './../plugin';
import { IScanState } from './../state/scan';
import { ScanActions } from './../actions/scan';

const initialState: IScanState = {
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

export default function(state = initialState, action: Action): IScanState {
  switch (action.type) {
    case ScanActions.PERMISSION_GRANTED:
      return updatePermission(state, true);
    case ScanActions.PERMISSION_DENIED:
      return updatePermission(state, false);
    case ScanActions.START_SCAN:
      return startScan(state);
    case ScanActions.STOP_SCAN:
      return stopScan(state);
    case ScanActions.ADD_DEVICE_INFO:
      return addDeviceInfo(state, action.payload);
    default:
      return state;
  }
}

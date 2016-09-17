import { Action } from 'redux';

import { DeviceActions } from './device';

export * from './device';

const APP_ACTIONS = [
  DeviceActions
];

export interface FluxAction extends Action {
  payload?: any;
  error?: boolean;
  meta?: any;
}

export default APP_ACTIONS;

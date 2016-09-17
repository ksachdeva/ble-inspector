import { Action as _Action } from 'redux';
import { DeviceActions } from './device';

export * from './device';

const APP_ACTIONS = [
  DeviceActions
];

export interface Action extends _Action {
  payload?: any;
  error?: boolean;
  meta?: any;
}

export default APP_ACTIONS;

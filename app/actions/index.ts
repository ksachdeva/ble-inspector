import { ScanActions } from './scan';
import { DeviceActions } from './device';

export * from './scan';
export * from './device';

const APP_ACTIONS = [
  ScanActions,
  DeviceActions
];

export default APP_ACTIONS;

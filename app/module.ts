import APP_EPICS from './epics';
import APP_ACTIONS from './actions';
import APP_SERVICES from './services';

const APP_PROVIDERS = [
  ...APP_ACTIONS,
  ...APP_SERVICES,
  ...APP_EPICS
];

export default APP_PROVIDERS;

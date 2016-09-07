import { provide } from '@angular/core';
import { provideStore, combineReducers } from '@ngrx/store';
import { runEffects } from '@ngrx/effects';
import { compose } from '@ngrx/core/compose';
import { storeLogger } from 'ngrx-store-logger';

import APP_REDUCERS from './reducers';
import APP_EFFECTS from './effects';
import APP_ACTIONS from './actions';
import APP_SERVICES from './services';

const reducers = compose(storeLogger(), combineReducers)(APP_REDUCERS);

const APP_PROVIDERS = [
  provideStore(reducers, {
  }),
  runEffects(APP_EFFECTS),
  ...APP_ACTIONS,
  ...APP_SERVICES
];

export default APP_PROVIDERS;

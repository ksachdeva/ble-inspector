import { combineReducers } from 'redux';

import { IAppState } from './../state';
import deviceReducer from './device';

const rootReducer = combineReducers<IAppState>({
  device: deviceReducer
});

export default rootReducer;

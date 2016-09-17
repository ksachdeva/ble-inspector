declare var require: any;

import { Component } from '@angular/core';
import { ionicBootstrap, Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { NgRedux } from 'ng2-redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';

const devTools = require('remote-redux-devtools');
const createLogger = require('redux-logger');

import APP_PROVIDERS from './module';
import { Action } from './actions';
import { DeviceEpics } from './epics/device';
import { IAppState, INITIAL_APP_STATE } from './state';
import rootReducer from './reducers';

import { HomePage } from './pages/home/home';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
  rootPage: any = HomePage;
  constructor(
    ngRedux: NgRedux<IAppState>,
    deviceEpics: DeviceEpics,
    platform: Platform) {

    const combinedEpics = combineEpics<Action>(
      ...deviceEpics.epics
    );

    const middleware = [
      createLogger(),
      createEpicMiddleware(combinedEpics)
    ];

    const enhancers = [
      // uncomment and specify your own configuration
      /*
      devTools({
        realtime: true,
        port: 8000,
        hostname: '192.168.1.78'
      })*/
    ];

    ngRedux.configureStore(
      rootReducer,
      INITIAL_APP_STATE,
      middleware,
      enhancers
    );

    platform.ready().then(() => {
      StatusBar.styleDefault();
    });

  }
}

ionicBootstrap(MyApp, [
  ...APP_PROVIDERS,
  NgRedux
]);

import { Observable } from 'rxjs';
import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Store } from '@ngrx/store';

import { IAppState } from './../../state';
import { IDeviceInfo, IService } from './../../plugin';
import { DeviceActions } from './../../actions';

@Component({
  templateUrl: 'build/pages/services/services.html'
})
export class ServicesPage {

  services$: Observable<Array<IService>>;
  selectedDevice: IDeviceInfo;

  connectEnabled$: Observable<boolean>;
  disconnectEnabled$: Observable<boolean>;

  constructor(
    private deviceActions: DeviceActions,
    private viewCtrl: ViewController,
    private store: Store<IAppState>,
    private navCtrl: NavController,
    private navParams: NavParams,
    private ngZone: NgZone) {

    this.selectedDevice = navParams.get('selectedDevice');

    const connected$ = store.select(s => s.device.connected);
    const connecting$ = store.select(s => s.device.connecting);

    this.connectEnabled$ = Observable.combineLatest(
      connected$, connecting$, (connected: boolean, connecting: boolean) => {
        return !connecting && !connected;
      });

    this.disconnectEnabled$ = Observable.combineLatest(
      connected$, connecting$, (connected: boolean, connecting: boolean) => {
        return !connecting && connected;
      });

    this.services$ = store.select(s => s.device.services);

    this.store.dispatch(this.deviceActions.monitorDeviceDisconnect());
    this.store.dispatch(this.deviceActions.connectToDevice(this.selectedDevice));
  }

  connect() {
    this.store.dispatch(this.deviceActions.connectToDevice(this.selectedDevice));
  }

  disconnect() {
    this.store.dispatch(this.deviceActions.disconnectDevice(this.selectedDevice));
  }

}

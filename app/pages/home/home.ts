import { Observable } from 'rxjs';
import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Store } from '@ngrx/store';

import { IAppState } from './../../state';
import { IDeviceInfo } from './../../plugin';
import { ScanActions } from './../../actions';

import { ServicesPage } from './../services/services';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  startScanEnabled$: Observable<boolean>;
  stopScanEnabled$: Observable<boolean>;

  devices$: Observable<Array<IDeviceInfo>>;

  constructor(
    private store: Store<IAppState>,
    private scanActions: ScanActions,
    private navCtrl: NavController,
    private ngZone: NgZone) {

    this.devices$ = store.select(s => s.scan.devices);

    const permission$ = store.select(s => s.scan.permission);
    const scanning$ = store.select(s => s.scan.scanning);

    this.startScanEnabled$ = Observable.combineLatest(
      permission$, scanning$, (permission: boolean, scanning: boolean) => {
        return permission && !scanning;
      });

    this.stopScanEnabled$ = Observable.combineLatest(
      permission$, scanning$, (permission: boolean, scanning: boolean) => {
        return permission && scanning;
      });

    this.store.dispatch(this.scanActions.requestPermission());
  }

  startScan() {
    this.store.dispatch(this.scanActions.startScan());
  }

  stopScan() {
    this.store.dispatch(this.scanActions.stopScan());
  }

  connectToDevice(device: IDeviceInfo) {
    this.navCtrl.push(ServicesPage, {
      selectedDevice: device
    });
  }
}

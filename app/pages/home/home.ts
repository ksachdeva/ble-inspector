import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Store } from '@ngrx/store';

import { BluetoothState } from './../../enums';
import { IAppState } from './../../state';
import { IDeviceInfo } from './../../plugin';
import { DeviceActions } from './../../actions';

import { ServicesPage } from './../services/services';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  startScanEnabled$: Observable<boolean>;
  stopScanEnabled$: Observable<boolean>;

  devices$: Observable<Array<IDeviceInfo>>;

  constructor(
    private platform: Platform,
    private store: Store<IAppState>,
    private deviceActions: DeviceActions,
    private navCtrl: NavController) {

    this.devices$ = store.select(s => s.device.devices);

    const permission$ = store.select(s => s.device.permission);
    const scanning$ = store.select(s => s.device.scanning);
    const bleState$ = store.select(s => s.device.bleState);

    const changeDetector = function(permission: boolean, scanning: boolean, bleState: BluetoothState) {
      const enable = permission && !scanning && (bleState === BluetoothState.PoweredOn);
      return enable;
    };

    this.startScanEnabled$ = Observable.combineLatest(
      permission$, scanning$, bleState$, changeDetector);

    this.stopScanEnabled$ = Observable.combineLatest(
      permission$, scanning$, (permission: boolean, scanning: boolean) => {
        return permission && scanning;
      });

    platform.ready().then(() => {

      if (platform.is('android')) {
        this.store.dispatch(this.deviceActions.requestPermission());
        this.store.dispatch(this.deviceActions.bleStateChanged(BluetoothState.PoweredOn));
      } else {
        this.store.dispatch(this.deviceActions.permissionGranted());
        this.store.dispatch(this.deviceActions.startStateMonitoring());
      }
    });
  }

  startScan() {
    this.store.dispatch(this.deviceActions.startScan());
  }

  stopScan() {
    this.store.dispatch(this.deviceActions.stopScan());
  }

  connectToDevice(device: IDeviceInfo) {
    this.navCtrl.push(ServicesPage, {
      selectedDevice: device
    });
  }
}

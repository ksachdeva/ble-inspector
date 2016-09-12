import 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import { Effect, StateUpdates } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Diagnostic } from 'ionic-native';

import { ScanActions } from './../actions/scan';
import { DeviceActions } from './../actions/device';
import { IAppState } from './../state';
import { BLECentralService } from './../services/ble-central';

@Injectable()
export class ScanEffects {

  @Effect() requestPermission$ = this.updates$
    .whenAction(ScanActions.PERMISSION_REQUEST)
    .mergeMap(() =>
      this.bleService.requestRuntimePermission()
        .map(res => {
          if (res === Diagnostic.permissionStatus.GRANTED) {
            return this.scanActions.permissionGranted();
          } else {
            return this.scanActions.permissionDenied();
          }
        })
    );

  @Effect() startScan$ = this.updates$
    .whenAction(ScanActions.START_SCAN)
    .mergeMap(() =>
      this.bleService.startScan()
        .map(res => this.ngZone.run(() => this.scanActions.addDeviceInfo(res)))
        .catch(err => Observable.of(this.deviceActions.bleError(err)))
    );

  @Effect() stopScan$ = this.updates$
    .whenAction(ScanActions.STOP_SCAN)
    .mergeMap(() =>
      this.bleService.stopScan()
        .map(res => this.ngZone.run(() => this.scanActions.stoppedScan()))
        .catch(err => Observable.of(this.deviceActions.bleError(err)))
    );


  constructor(
    private updates$: StateUpdates<IAppState>,
    private ngZone: NgZone,
    private scanActions: ScanActions,
    private deviceActions: DeviceActions,
    private bleService: BLECentralService
  ) { }

}

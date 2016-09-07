import 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, StateUpdates, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Diagnostic } from 'ionic-native';

import { ScanActions } from './../actions/scan';
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
    );

  @Effect() stopScan$ = this.updates$
    .whenAction(ScanActions.STOP_SCAN)
    .mergeMap(() =>
      this.bleService.stopScan()
        .map(res => this.ngZone.run(() => this.scanActions.stoppedScan()))
    );


  constructor(
    private updates$: StateUpdates<IAppState>,
    private ngZone: NgZone,
    private scanActions: ScanActions,
    private bleService: BLECentralService
  ) { }

}

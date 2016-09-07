import { Observable } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import { Diagnostic } from 'ionic-native';

import { Central, IDeviceInfo } from './../plugin';

@Injectable()
export class BLECentralService {

  constructor(private ngZone: NgZone) {
  }

  requestRuntimePermission(): Observable<string> {
    const permission = Diagnostic.permission.ACCESS_COARSE_LOCATION;
    return Observable.fromPromise(Diagnostic.requestRuntimePermission(permission));
  }

  startScan(): Observable<IDeviceInfo> {
    return Central.startDeviceScan(null);
  }

  stopScan(): Observable<any> {
    return Observable.fromPromise(Central.stopScan());
  }

}

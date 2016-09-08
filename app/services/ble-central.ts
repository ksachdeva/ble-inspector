import { Observable } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import { Diagnostic } from 'ionic-native';

import { Central, IDeviceInfo, IService } from './../plugin';

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

  connectToDevice(device: IDeviceInfo): Observable<IDeviceInfo> {
    return Observable.fromPromise(Central.connectToDevice({
      deviceId: device.uuid
    }));
  }

  disconnectDevice(device: IDeviceInfo): Observable<IDeviceInfo> {
    return Observable.fromPromise(Central.disconnectDevice({
      deviceId: device.uuid
    }));
  }

  isDeviceConnected(device: IDeviceInfo): Observable<boolean> {
    return Observable.fromPromise(Central.isDeviceConnected({
      deviceId: device.uuid
    }));
  }

  monitorDeviceDisconnect(): Observable<IDeviceInfo> {
    return Central.monitorDeviceDisconnect();
  }

  discoverServices(device: IDeviceInfo): Observable<Array<IService>> {
    return Observable.fromPromise(Central.discoverServices({
      deviceId: device.uuid
    }));
  }

}

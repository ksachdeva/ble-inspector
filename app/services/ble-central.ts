declare var require: any;
import { Observable } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import { Diagnostic } from 'ionic-native';
import { enterZone } from 'rxjs-zone-operators';
require('rxjs-zone-operators');
import { BluetoothState } from './../enums';
import { Central, IDeviceInfo, IService, ICharacteristic } from './../plugin';

@Injectable()
export class BLECentralService {

  constructor(private ngZone: NgZone) {
  }

  requestRuntimePermission(): Observable<string> {
    const permission = Diagnostic.permission.ACCESS_COARSE_LOCATION;
    return Observable.fromPromise(Diagnostic.requestRuntimePermission(permission))
      .enterZone(this.ngZone);
  }

  startScan(): Observable<IDeviceInfo> {
    return Central.startDeviceScan(null)
      .enterZone(this.ngZone);
  }

  stopScan(): Observable<any> {
    return Observable.fromPromise(Central.stopScan()).enterZone(this.ngZone);
  }

  connectToDevice(device: IDeviceInfo): Observable<IDeviceInfo> {
    return Observable.fromPromise(Central.connectToDevice({
      deviceId: device.uuid
    })).enterZone(this.ngZone);
  }

  disconnectDevice(device: IDeviceInfo): Observable<IDeviceInfo> {
    return Observable.fromPromise(Central.disconnectDevice({
      deviceId: device.uuid
    }));
  }

  isDeviceConnected(device: IDeviceInfo): Observable<boolean> {
    return Observable.fromPromise(Central.isDeviceConnected({
      deviceId: device.uuid
    })).enterZone(this.ngZone);
  }

  monitorDeviceDisconnect(): Observable<IDeviceInfo> {
    return Central.monitorDeviceDisconnect().enterZone(this.ngZone);
  }

  monitorCharacteristic(characteristic: ICharacteristic, transactionId: string): Observable<ICharacteristic> {
    return Central.monitorCharacteristic({
      deviceId: characteristic.deviceUUID,
      serviceUUID: characteristic.serviceUUID,
      charUUID: characteristic.uuid,
      transactionId: transactionId
    });
  }

  _mapToBluetoothState(state: string): BluetoothState {
    switch (state) {
      case 'Unknown':
        return BluetoothState.Unknown;
      case 'Resetting':
        return BluetoothState.Resetting;
      case 'Unsupported':
        return BluetoothState.Unsupported;
      case 'Unauthorized':
        return BluetoothState.Unauthorized;
      case 'PoweredOff':
        return BluetoothState.PoweredOff;
      case 'PoweredOn':
        return BluetoothState.PoweredOn;
    }
  }

  getState(): Observable<BluetoothState> {
    return Observable.fromPromise(Central.getState())
      .enterZone(this.ngZone)
      .map(state => this._mapToBluetoothState(state));
  }

  monitorState(): Observable<BluetoothState> {
    return Central.monitorState()
      .enterZone(this.ngZone)
      .map(state => this._mapToBluetoothState(state));
  }

  stopCharacteristicMonitoring(characteristic: ICharacteristic, transactionId: string): Observable<void> {
    return Observable.fromPromise(Central.cancelTransaction(transactionId))
      .enterZone(this.ngZone);
  }

  discoverServices(device: IDeviceInfo): Observable<Array<IService>> {
    return Observable.fromPromise(Central.discoverServices({
      deviceId: device.uuid
    })).enterZone(this.ngZone);
  }

  discoverCharacteristics(service: IService): Observable<Array<ICharacteristic>> {
    return Observable.fromPromise(Central.discoverCharacteristics({
      deviceId: service.deviceUUID,
      serviceUUID: service.uuid
    })).enterZone(this.ngZone);
  }

  readCharacteristic(characteristic: ICharacteristic, transactionId: string): Observable<ICharacteristic> {
    return Observable.fromPromise(Central.readCharacteristic({
      deviceId: characteristic.deviceUUID,
      serviceUUID: characteristic.serviceUUID,
      charUUID: characteristic.uuid,
      transactionId: transactionId
    })).enterZone(this.ngZone);
  }

  writeCharacteristic(characteristic: ICharacteristic, value: string, response: boolean, transactionId: string): Observable<ICharacteristic> {
    return Observable.fromPromise(Central.writeCharacteristic({
      deviceId: characteristic.deviceUUID,
      serviceUUID: characteristic.serviceUUID,
      charUUID: characteristic.uuid,
      transactionId: transactionId,
      value: value,
      withResponse: response
    })).enterZone(this.ngZone);
  }

}

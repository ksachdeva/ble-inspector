import 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import { Effect, StateUpdates, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { IDeviceInfo, IService } from './../plugin';
import { DeviceActions } from './../actions/device';
import { IAppState, ICharacteristicState } from './../state';
import { BLECentralService } from './../services/ble-central';

@Injectable()
export class DeviceEffects {

  @Effect() connectToDevice$ = this.updates$
    .whenAction(DeviceActions.CONNECT_TO_DEVICE)
    .map<IDeviceInfo>(toPayload)
    .mergeMap((deviceInfo) =>
      this.bleService.connectToDevice(deviceInfo)
        .map(res => this.ngZone.run(() => this.deviceActions.connectedToDevice(res)))
        .catch(err => Observable.of(this.deviceActions.failedToConnectDevice(deviceInfo, err)))
    );

  @Effect() disconnectDevice$ = this.updates$
    .whenAction(DeviceActions.DISCONNECT_DEVICE)
    .map<IDeviceInfo>(toPayload)
    .mergeMap((deviceInfo) =>
      this.bleService.disconnectDevice(deviceInfo)
        .map(res => this.ngZone.run(() => this.deviceActions.deviceDisconnected(res)))
        .catch(err => Observable.of(this.deviceActions.bleError(err)))
    );

  @Effect() monitorDisconnect$ = this.updates$
    .whenAction(DeviceActions.MONITOR_DEVICE_DISCONNECT)
    .mergeMap((deviceInfo) =>
      this.bleService.monitorDeviceDisconnect()
        .map(res => this.ngZone.run(() => this.deviceActions.deviceDisconnected(res)))
        .catch(err => Observable.of(this.deviceActions.bleError(err)))
    );

  @Effect() deviceConnected$ = this.updates$
    .whenAction(DeviceActions.CONNECTED_TO_DEVICE)
    .map<IDeviceInfo>(toPayload)
    .map(deviceInfo => this.deviceActions.discoverServices(deviceInfo));

  @Effect() discoverServices$ = this.updates$
    .whenAction(DeviceActions.START_SERVICE_DISCOVERY)
    .map<IDeviceInfo>(toPayload)
    .mergeMap((deviceInfo) =>
      this.bleService.discoverServices(deviceInfo)
        .map(res => this.ngZone.run(() => this.deviceActions.discoveredServices(res)))
        .catch(err => Observable.of(this.deviceActions.bleError(err)))
    );

  @Effect() discoverCharacterisitics$ = this.updates$
    .whenAction(DeviceActions.START_CHARACTERISTICS_DISCOVERY)
    .map<IService>(toPayload)
    .mergeMap((service) =>
      this.bleService.discoverCharacteristics(service)
        .map(res => this.ngZone.run(() => this.deviceActions.discoveredCharacteristics(res)))
        .catch(err => Observable.of(this.deviceActions.bleError(err)))
    );

  @Effect() monitorCharacteristic$ = this.updates$
    .whenAction(DeviceActions.START_CHARACTERISTIC_MONITORING)
    .map<ICharacteristicState>(toPayload)
    .mergeMap((charState) =>
      this.bleService.monitorCharacteristic(charState.characteristic, charState.transactionId)
        .map(res => this.ngZone.run(() => this.deviceActions.readCharacteristic(res)))
        .catch(err => Observable.of(this.deviceActions.bleError(err)))
    );

  @Effect() stopCharacteristicMonitoring$ = this.updates$
    .whenAction(DeviceActions.STOP_CHARACTERISTIC_MONITORING)
    .map<ICharacteristicState>(toPayload)
    .mergeMap((charState) =>
      this.bleService.stopCharacteristicMonitoring(charState.characteristic, charState.transactionId)
        .map(() => this.ngZone.run(() => this.deviceActions.stoppedCharacteristicMonitoring(charState)))
        .catch(err => Observable.of(this.deviceActions.bleError(err)))
    );

  @Effect() readCharacteristic$ = this.updates$
    .whenAction(DeviceActions.START_READING_CHARACTERISITIC)
    .map<ICharacteristicState>(toPayload)
    .mergeMap((charState) =>
      this.bleService.readCharacteristic(charState.characteristic, charState.transactionId)
        .map((res) => this.ngZone.run(() => this.deviceActions.readCharacteristic(res)))
        .catch(err => Observable.of(this.deviceActions.bleError(err)))
    );

  @Effect() writeCharacteristic$ = this.updates$
    .whenAction(DeviceActions.START_WRITING_CHARACTERISITIC)
    .map<{ charState: ICharacteristicState; value: string; withResponse: boolean; }>(toPayload)
    .mergeMap((payload) =>
      this.bleService.writeCharacteristic(payload.charState.characteristic, payload.value, payload.withResponse, payload.charState.transactionId)
        .map((res) => this.ngZone.run(() => this.deviceActions.wroteCharacteristic(res)))
        .catch(err => Observable.of(this.deviceActions.bleError(err)))
    );

  constructor(
    private updates$: StateUpdates<IAppState>,
    private ngZone: NgZone,
    private deviceActions: DeviceActions,
    private bleService: BLECentralService
  ) { }

}

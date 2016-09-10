import 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, StateUpdates, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Diagnostic } from 'ionic-native';

import { IDeviceInfo, IService } from './../plugin';
import { DeviceActions } from './../actions/device';
import { IAppState } from './../state';
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
    );

  @Effect() monitorDisconnect$ = this.updates$
    .whenAction(DeviceActions.MONITOR_DEVICE_DISCONNECT)
    .mergeMap((deviceInfo) =>
      this.bleService.monitorDeviceDisconnect()
        .map(res => this.ngZone.run(() => this.deviceActions.deviceDisconnected(res)))
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
    );

  @Effect() discoverCharacterisitics$ = this.updates$
    .whenAction(DeviceActions.START_CHARACTERISTICS_DISCOVERY)
    .map<IService>(toPayload)
    .mergeMap((service) =>
      this.bleService.discoverCharacteristics(service)
        .map(res => this.ngZone.run(() => this.deviceActions.discoveredCharacteristics(res)))
    );

  constructor(
    private updates$: StateUpdates<IAppState>,
    private ngZone: NgZone,
    private deviceActions: DeviceActions,
    private bleService: BLECentralService
  ) { }

}

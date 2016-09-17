import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Diagnostic } from 'ionic-native';
import { ActionsObservable } from 'redux-observable';

import { IDeviceInfo, IService } from './../plugin';
import { DeviceActions } from './../actions/device';
import { Action } from './../actions';
import { IAppState, ICharacteristicState } from './../state';
import { BLECentralService } from './../services/ble-central';

@Injectable()
export class DeviceEpics {

  requestPermission$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.PERMISSION_REQUEST)
      .mergeMap(() =>
        this.bleService.requestRuntimePermission()
          .map(res => {
            if (res === Diagnostic.permissionStatus.GRANTED) {
              return this.deviceActions.permissionGranted();
            } else {
              return this.deviceActions.permissionDenied();
            }
          })
      );

  startScan$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.START_SCAN)
      .mergeMap(() =>
        this.bleService.startScan()
          .map(res => this.deviceActions.addDeviceInfo(res))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  stopScan$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.STOP_SCAN)
      .mergeMap(() =>
        this.bleService.stopScan()
          .map(res => this.deviceActions.stoppedScan())
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  connectToDevice$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.CONNECT_TO_DEVICE)
      .map(action => action.payload)
      .mergeMap((deviceInfo) =>
        this.bleService.connectToDevice(deviceInfo)
          .map((res) => this.deviceActions.connectedToDevice(res))
          .catch(err => Observable.of(this.deviceActions.failedToConnectDevice(deviceInfo, err)))
      );

  disconnectDevice$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.DISCONNECT_DEVICE)
      .map(action => action.payload)
      .mergeMap((deviceInfo) =>
        this.bleService.disconnectDevice(deviceInfo)
          .map((res) => this.deviceActions.deviceDisconnected(res))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  monitorDisconnect$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.MONITOR_DEVICE_DISCONNECT)
      .mergeMap((deviceInfo) =>
        this.bleService.monitorDeviceDisconnect()
          .map((res) => this.deviceActions.deviceDisconnected(res))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  deviceConnected$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.CONNECTED_TO_DEVICE)
      .map(action => action.payload)
      .map(deviceInfo => this.deviceActions.discoverServices(deviceInfo));

  discoverServices$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.START_SERVICE_DISCOVERY)
      .map(action => action.payload)
      .mergeMap((deviceInfo) =>
        this.bleService.discoverServices(deviceInfo)
          .map(res => this.deviceActions.discoveredServices(res))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  discoverCharacterisitics$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.START_CHARACTERISTICS_DISCOVERY)
      .map(action => action.payload)
      .mergeMap((service) =>
        this.bleService.discoverCharacteristics(service)
          .map(res => this.deviceActions.discoveredCharacteristics(res))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  monitorCharacteristic$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.START_CHARACTERISTIC_MONITORING)
      .map(action => action.payload)
      .mergeMap((charState) =>
        this.bleService.monitorCharacteristic(charState.characteristic, charState.transactionId)
          .map(res => this.deviceActions.readCharacteristic(res))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );


  stopCharacteristicMonitoring$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.STOP_CHARACTERISTIC_MONITORING)
      .map(action => action.payload)
      .mergeMap((charState) =>
        this.bleService.stopCharacteristicMonitoring(charState.characteristic, charState.transactionId)
          .map(() => this.deviceActions.stoppedCharacteristicMonitoring(charState))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  readCharacteristic$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.START_READING_CHARACTERISITIC)
      .map(action => action.payload)
      .mergeMap((charState) =>
        this.bleService.readCharacteristic(charState.characteristic, charState.transactionId)
          .map((res) => this.deviceActions.readCharacteristic(res))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  writeCharacteristic$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.START_WRITING_CHARACTERISITIC)
      .map(action => action.payload)
      .mergeMap((payload) =>
        this.bleService.writeCharacteristic(payload.charState.characteristic, payload.value, payload.withResponse, payload.charState.transactionId)
          .map((res) => this.deviceActions.wroteCharacteristic(res))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  getState$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.GET_CURRENT_STATE)
      .mergeMap(() =>
        this.bleService.getState()
          .map((res) => this.deviceActions.bleStateChanged(res))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  monitorStateChange$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.START_STATE_MONITOR)
      .mergeMap(() =>
        this.bleService.monitorState()
          .map((res) => this.deviceActions.bleStateChanged(res))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  constructor(
    private deviceActions: DeviceActions,
    private bleService: BLECentralService
  ) { }

}

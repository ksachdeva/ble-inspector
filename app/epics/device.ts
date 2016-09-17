import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Diagnostic } from 'ionic-native';
import { ActionsObservable } from 'redux-observable';

import { IDeviceInfo, IService } from './../plugin';
import { DeviceActions } from './../actions/device';
import { Action } from './../actions';
import { ICharacteristicState } from './../state';
import { BLECentralService } from './../services/ble-central';

function toPayload(action: Action): any {
  return action.payload;
}

@Injectable()
export class DeviceEpics {

  private requestPermission$ = (action$: ActionsObservable<Action>) =>
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

  private startScan$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.START_SCAN)
      .mergeMap(() =>
        this.bleService.startScan()
          .map(res => this.deviceActions.addDeviceInfo(res))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  private stopScan$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.STOP_SCAN)
      .mergeMap(() =>
        this.bleService.stopScan()
          .map(res => this.deviceActions.stoppedScan())
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  private connectToDevice$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.CONNECT_TO_DEVICE)
      .map<IDeviceInfo>(toPayload)
      .mergeMap((deviceInfo) =>
        this.bleService.connectToDevice(deviceInfo)
          .map((res) => this.deviceActions.connectedToDevice(res))
          .catch(err => Observable.of(this.deviceActions.failedToConnectDevice(deviceInfo, err)))
      );

  private disconnectDevice$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.DISCONNECT_DEVICE)
      .map<IDeviceInfo>(toPayload)
      .mergeMap((deviceInfo) =>
        this.bleService.disconnectDevice(deviceInfo)
          .map((res) => this.deviceActions.deviceDisconnected(res))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  private monitorDisconnect$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.MONITOR_DEVICE_DISCONNECT)
      .mergeMap(() =>
        this.bleService.monitorDeviceDisconnect()
          .map((res) => this.deviceActions.deviceDisconnected(res))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  private deviceConnected$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.CONNECTED_TO_DEVICE)
      .map<IDeviceInfo>(toPayload)
      .map((deviceInfo) => this.deviceActions.discoverServices(deviceInfo));

  private discoverServices$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.START_SERVICE_DISCOVERY)
      .map<IDeviceInfo>(toPayload)
      .mergeMap((deviceInfo) =>
        this.bleService.discoverServices(deviceInfo)
          .map(res => this.deviceActions.discoveredServices(res))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  private discoverCharacterisitics$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.START_CHARACTERISTICS_DISCOVERY)
      .map<IService>(toPayload)
      .mergeMap((service) =>
        this.bleService.discoverCharacteristics(service)
          .map(res => this.deviceActions.discoveredCharacteristics(res))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  private monitorCharacteristic$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.START_CHARACTERISTIC_MONITORING)
      .map<ICharacteristicState>(toPayload)
      .mergeMap((charState) =>
        this.bleService.monitorCharacteristic(charState.characteristic, charState.transactionId)
          .map(res => this.deviceActions.readCharacteristic(res))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );


  private stopCharacteristicMonitoring$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.STOP_CHARACTERISTIC_MONITORING)
      .map<ICharacteristicState>(toPayload)
      .mergeMap((charState) =>
        this.bleService.stopCharacteristicMonitoring(charState.characteristic, charState.transactionId)
          .map(() => this.deviceActions.stoppedCharacteristicMonitoring(charState))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  private readCharacteristic$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.START_READING_CHARACTERISITIC)
      .map<ICharacteristicState>(toPayload)
      .mergeMap((charState) =>
        this.bleService.readCharacteristic(charState.characteristic, charState.transactionId)
          .map((res) => this.deviceActions.readCharacteristic(res))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  private writeCharacteristic$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.START_WRITING_CHARACTERISITIC)
      .map<{ charState: ICharacteristicState; value: string; withResponse: boolean; }>(toPayload)
      .mergeMap((payload) =>
        this.bleService.writeCharacteristic(payload.charState.characteristic, payload.value, payload.withResponse, payload.charState.transactionId)
          .map((res) => this.deviceActions.wroteCharacteristic(res))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  private getState$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.GET_CURRENT_STATE)
      .mergeMap(() =>
        this.bleService.getState()
          .map((res) => this.deviceActions.bleStateChanged(res))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  private monitorStateChange$ = (action$: ActionsObservable<Action>) =>
    action$.ofType(DeviceActions.START_STATE_MONITOR)
      .mergeMap(() =>
        this.bleService.monitorState()
          .map((res) => this.deviceActions.bleStateChanged(res))
          .catch(err => Observable.of(this.deviceActions.bleError(err)))
      );

  epics = [
    this.requestPermission$,
    this.startScan$,
    this.stopScan$,
    this.connectToDevice$,
    this.disconnectDevice$,
    this.monitorDisconnect$,
    this.deviceConnected$,
    this.discoverServices$,
    this.discoverCharacterisitics$,
    this.monitorCharacteristic$,
    this.stopCharacteristicMonitoring$,
    this.readCharacteristic$,
    this.writeCharacteristic$,
    this.getState$,
    this.monitorStateChange$
  ];

  constructor(
    private deviceActions: DeviceActions,
    private bleService: BLECentralService
  ) { }

}

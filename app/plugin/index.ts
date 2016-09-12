import { Observable } from 'rxjs';
import { Plugin, Cordova } from 'ionic-native';

export interface IDeviceInfo {
  uuid: string;
  rssi: number;
}

export interface IService {
  uuid: string;
  deviceUUID: string;
  isPrimary: string;
}

export interface ICharacteristic {
  uuid: string;
  deviceUUID: string;
  serviceUUID: string;
  isReadable: boolean;
  isWritableWithResponse: boolean;
  isWritableWithoutResponse: boolean;
  isNotifiable: boolean;
  isIndictable: boolean;
  value: string;
}

@Plugin({
  plugin: 'cordova.plugins.ble.Central',
  pluginRef: 'cordova.plugins.ble.Central'
})
export class Central {

  @Cordova({
    observable: true
  })
  static startDeviceScan(options: any): Observable<IDeviceInfo> {
    return;
  }

  @Cordova()
  static stopScan(): Promise<any> {
    return;
  }

  @Cordova()
  static connectToDevice(options: any): Promise<any> {
    return;
  }

  @Cordova()
  static disconnectDevice(options: any): Promise<any> {
    return;
  }

  @Cordova()
  static isDeviceConnected(options: any): Promise<boolean> {
    return;
  }

  @Cordova()
  static discoverServices(options: any): Promise<Array<IService>> {
    return;
  }

  @Cordova()
  static discoverCharacteristics(options: any): Promise<Array<ICharacteristic>> {
    return;
  }

  @Cordova({
    observable: true
  })
  static monitorDeviceDisconnect(): Observable<IDeviceInfo> {
    return;
  }

  @Cordova({
    observable: true
  })
  static monitorCharacteristic(options: any): Observable<ICharacteristic> {
    return;
  }

  @Cordova()
  static cancelTransaction(transactionId: string): Promise<void> {
    return;
  }

  @Cordova()
  static readCharacteristic(options: any): Promise<ICharacteristic> {
    return;
  }

  @Cordova()
  static writeCharacteristic(options: any): Promise<ICharacteristic> {
    return;
  }

  @Cordova()
  static getState(): Promise<string> {
    return;
  }

  @Cordova({
    observable: true
  })
  static monitorState(): Observable<string> {
    return;
  }

}

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

  @Cordova({
    observable: true
  })
  static monitorDeviceDisconnect(): Observable<IDeviceInfo> {
    return;
  }
}

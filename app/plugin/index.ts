import { Observable } from 'rxjs';
import { Plugin, Cordova } from 'ionic-native';

export interface IDeviceInfo {
  uuid: string;
  rssi: boolean;
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
}

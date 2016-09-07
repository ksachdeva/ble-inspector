import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { IDeviceInfo } from './../plugin';

@Injectable()
export class ScanActions {

  static PERMISSION_REQUEST = 'Request Permission';
  static PERMISSION_GRANTED = 'Permission Granted';
  static PERMISSION_DENIED = 'Permission Denied';

  static START_SCAN = 'Start Scan';
  static STARTED_SCAN = 'Started Scan';
  static START_SCAN_FAILED = 'Start Scan Failed';

  static STOP_SCAN = 'Stop Scan';
  static STOPPED_SCAN = 'Stopped Scan';
  static STOP_SCAN_FAILED = 'Stop Scan Failed';

  static ADD_DEVICE_INFO = 'Add Device Info';

  addDeviceInfo(payload: IDeviceInfo): Action {
    return {
      type: ScanActions.ADD_DEVICE_INFO,
      payload
    };
  }

  requestPermission(): Action {
    return {
      type: ScanActions.PERMISSION_REQUEST
    };
  }

  permissionGranted(): Action {
    return {
      type: ScanActions.PERMISSION_GRANTED
    };
  }

  permissionDenied(): Action {
    return {
      type: ScanActions.PERMISSION_DENIED
    };
  }

  startScan(): Action {
    return {
      type: ScanActions.START_SCAN
    };
  }

  startedScan(): Action {
    return {
      type: ScanActions.STARTED_SCAN
    };
  }

  stopScan(): Action {
    return {
      type: ScanActions.STOP_SCAN
    };
  }

  stoppedScan(): Action {
    return {
      type: ScanActions.STOPPED_SCAN
    };
  }
}

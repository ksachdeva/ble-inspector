import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Component, NgZone } from '@angular/core';
import { NavController, AlertController, ActionSheetController, NavParams, ViewController } from 'ionic-angular';
import { NgRedux } from 'ng2-redux';

import { IAppState, ICharacteristicState } from './../../state';
import { ICharacteristic, IService } from './../../plugin';
import { DeviceActions } from './../../actions';

@Component({
  templateUrl: 'build/pages/characteristics/characteristics.html'
})
export class CharacteristicsPage {

  chars: Array<ICharacteristicState>;
  selectedService: IService;
  connected$: Observable<boolean>;

  constructor(
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private deviceActions: DeviceActions,
    private viewCtrl: ViewController,
    private store: NgRedux<IAppState>,
    private navCtrl: NavController,
    private navParams: NavParams,
    private ngZone: NgZone) {

    this.selectedService = navParams.get('selectedService');

    this.connected$ = store.select(s => s.device.connected);

    const chars$ = store.select(s => s.device.chars);
    chars$.subscribe(characterisitics => {
      this.chars = _.filter(characterisitics, (c) => c.characteristic.serviceUUID === this.selectedService.uuid);
    });
  }

  ngOnInit() {
    this.store.dispatch(this.deviceActions.discoverCharacterisitics(this.selectedService));
  }

  startMonitoring(charState: ICharacteristicState) {
    this.store.dispatch(this.deviceActions.startCharacteristicMonitoring(charState));
  }

  stopMonitoring(charState: ICharacteristicState) {
    this.store.dispatch(this.deviceActions.stopCharacteristicMonitoring(charState));
  }

  readCharacteristic(charState: ICharacteristicState) {
    this.store.dispatch(this.deviceActions.startReadingCharacteristic(charState));
  }

  writeCharacteristic(charState: ICharacteristicState) {

    let prompt = this.alertCtrl.create({
      title: 'Characteristic Value',
      message: 'Enter hex string as the value',
      inputs: [
        {
          name: 'Value',
          placeholder: '010203'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.store.dispatch(this.deviceActions.startWritingCharacteristic(charState, data.Value, false));
          }
        }
      ]
    });

    prompt.present();
  }

  showOptions(charState: ICharacteristicState) {

    const monitorTitle = charState.transactionId === null ? 'Monitor' : 'Cancel Monitor';

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select',
      buttons: [
        {
          text: monitorTitle,
          handler: () => {
            if (charState.transactionId === null) {
              this.startMonitoring(charState);
            } else {
              this.stopMonitoring(charState);
            }
          }
        }, {
          text: 'Read',
          handler: () => {
            this.readCharacteristic(charState);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

}

import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Component, NgZone } from '@angular/core';
import { NavController, ActionSheetController, NavParams, ViewController } from 'ionic-angular';
import { Store } from '@ngrx/store';

import { IAppState, ICharacteristicState } from './../../state';
import { ICharacteristic, IService } from './../../plugin';
import { DeviceActions } from './../../actions';

@Component({
  templateUrl: 'build/pages/characteristics/characteristics.html'
})
export class CharacteristicsPage {

  chars: Array<ICharacteristicState>;
  selectedService: IService;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private deviceActions: DeviceActions,
    private viewCtrl: ViewController,
    private store: Store<IAppState>,
    private navCtrl: NavController,
    private navParams: NavParams,
    private ngZone: NgZone) {

    this.selectedService = navParams.get('selectedService');

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
            console.log('Archive clicked');
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

import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Store } from '@ngrx/store';

import { IAppState } from './../../state';
import { ICharacteristic, IService } from './../../plugin';
import { DeviceActions } from './../../actions';

@Component({
  templateUrl: 'build/pages/characteristics/characteristics.html'
})
export class CharacteristicsPage {

  chars: Array<ICharacteristic>;
  selectedService: IService;

  constructor(
    private deviceActions: DeviceActions,
    private viewCtrl: ViewController,
    private store: Store<IAppState>,
    private navCtrl: NavController,
    private navParams: NavParams,
    private ngZone: NgZone) {

    this.selectedService = navParams.get('selectedService');

    console.log(this.selectedService);

    /*viewCtrl.didEnter.subscribe(() => {
      this.deviceActions.discoverCharacterisitics(this.selectedService);
    });*/

    const chars$ = store.select(s => s.device.chars);
    chars$.subscribe(characterisitics => {
      this.chars = _.filter(characterisitics, (c) => c.serviceUUID === this.selectedService.uuid);
    });
  }

  ngOnInit() {
    this.store.dispatch(this.deviceActions.discoverCharacterisitics(this.selectedService));
  }

}

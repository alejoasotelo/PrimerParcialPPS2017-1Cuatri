import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Vibration } from '@ionic-native/vibration';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private vibrating : boolean = false;
  private items: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController, private vibration: Vibration, af: AngularFire) {
      this.vibration = vibration;
      this.items = af.database.list('/preguntas');
  }

  toggleVibrator(): void {
      this.vibrating = true;
      this.vibration.vibrate(1000);
      this.vibration.vibrate(0);
      this.vibrating = false;
  }

}

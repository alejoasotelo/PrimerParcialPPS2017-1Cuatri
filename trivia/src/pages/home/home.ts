import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private vibrating : boolean = false;

  constructor(public navCtrl: NavController, private vibration: Vibration) {
      this.vibration = vibration;
  }

  toggleVibrator(): void {
      this.vibrating = true;
      this.vibration.vibrate(1000);
      this.vibration.vibrate(0);
      this.vibrating = false;
  }

}

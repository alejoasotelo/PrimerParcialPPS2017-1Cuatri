import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Vibration } from '@ionic-native/vibration';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';

import { JuegoPage } from '../juego/juego';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    public user = {
        username: ''
    };

    constructor(public navCtrl: NavController) {
    }

    login() : void {

        this.navCtrl.setRoot(JuegoPage, this.user.username);

    }

}

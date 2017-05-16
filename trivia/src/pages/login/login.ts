import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

    private dir;

  constructor(public navCtrl: NavController, private file: File) {

      this.dir = file.dataDirectory

  }

}

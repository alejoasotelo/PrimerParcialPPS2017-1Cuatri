import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
    selector: 'page-resultados',
    templateUrl: 'resultados.html'
})
export class ResultadosPage {

    private usuarios : FirebaseListObservable<any[]>;

    constructor(public navCtrl: NavController, af: AngularFire) {

        this.usuarios = af.database.list('/usuarios', {
            query: {
                limitToLast: 10
            }
        });

        /*this.usuarios.subscribe(snapshots=>{
            snapshots.forEach(snapshot => {
              console.log(snapshot);
            });
        });*/

    }

}

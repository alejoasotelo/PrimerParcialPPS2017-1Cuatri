import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
    selector: 'page-resultados',
    templateUrl: 'resultados.html'
})
export class ResultadosPage {

    private usuarios : FirebaseListObservable<any[]>;
    private cargando_usuarios = false;
    private error;

    constructor(public navCtrl: NavController, af: AngularFire) {
        this.cargando_usuarios = true;

        let self = this;

        this.usuarios = af.database.list('/usuarios', {
            query: {
                limitToLast: 10
            }
        });

        this.usuarios.subscribe(
            function (x) {
                self.cargando_usuarios = false;
                console.log('onNext: %s', x);
            },
            function (e) {
                self.cargando_usuarios = false;
                self.error = e;
                console.log('onError: %s', e);
            }
        );

    }

}

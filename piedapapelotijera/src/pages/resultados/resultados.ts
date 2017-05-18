import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
    selector: 'page-resultados',
    templateUrl: 'resultados.html'
})
export class ResultadosPage {

    private usuarios : FirebaseListObservable<any[]>;

    private filtro = 1;
    private af;

    constructor(public navCtrl: NavController, af: AngularFire) {

        this.af = af;

        this.usuarios = af.database.list('/piedrapapelotijera/usuarios', {
            query: {
                limitToLast: 10
            }
        });

    }

    onChange(new_value) {
        new_value = parseInt(new_value);

        // Mostrar todos
        if (new_value == 2) {

            this.usuarios = this.af.database.list('/piedrapapelotijera/usuarios', {
                query: {
                    orderByChild: 'fecha_creacion',
                    limitToLast: 20
                }
            });

        } else {

            this.usuarios = this.af.database.list('/piedrapapelotijera/usuarios', {
                query: {
                    orderByChild: 'resultado',
                    limitToLast: 10,
                    equalTo: new_value
                }
            });

        }
    }

}

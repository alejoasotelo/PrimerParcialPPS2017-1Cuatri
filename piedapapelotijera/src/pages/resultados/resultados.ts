import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
    selector: 'page-resultados',
    templateUrl: 'resultados.html'
})
export class ResultadosPage {

    private usuarios : FirebaseListObservable<any[]>;

    private filtro = 2;
    private af;

    private cargando_usuarios = false;
    private error;

    constructor(public navCtrl: NavController, af: AngularFire) {

        this.af = af;

        // Cargo todos los resultados.
        this.onChange(2);

    }

    onChange(new_value) {
        this.cargando_usuarios = true;

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

        let self = this;

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

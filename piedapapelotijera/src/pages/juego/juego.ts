import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { Vibration } from '@ionic-native/vibration';

import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { LoginPage } from '../login/login';

@Component({
    selector: 'page-juego',
    templateUrl: 'juego.html'
})

export class JuegoPage {

    private vibrating : boolean = false;

    private usuario;

    private usuarios : FirebaseListObservable<any[]>;

    private audio : NativeAudio;

    constructor(public navCtrl: NavController, private param : NavParams, private vibration: Vibration, af: AngularFire, private nativeAudio: NativeAudio) {
        console.log(param.data);

        // conecto con la base de datos Firebase.
        this.usuarios = af.database.list('/piedrapapelotijera/usuarios');

        let d = new Date();
        this.usuario = {
            nombre: param.data,
            fecha_creacion: d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getMinutes()
        };

        /* Cargo los audios */
        this.audio = nativeAudio;
        this.audio.preloadSimple('correcto', 'assets/audios/correcto.mp3');
        this.audio.preloadSimple('incorrecto', 'assets/audios/incorrecto.mp3');

        this.vibration = vibration;

        this.inicializar();
    }

    inicializar() {
    }

    finalizar() {
        this.irAlLogin();
    }

    guardarUsuario(usuario) {
        console.log(usuario);
        this.usuarios.push(usuario);
    }

    irAlLogin() {
        this.navCtrl.setRoot(LoginPage);
    }

    vibrar(es_correcta : boolean) {

        if (es_correcta) {
            this.vibrating = true;
            this.vibration.vibrate(400);
            this.vibrating = false;
        } else {
            this.vibrating = true;
            this.vibration.vibrate([400,400,400]);
            this.vibrating = false;
        }

    }

    emitirSonido(es_correcta : boolean) {

        if (es_correcta) {
            this.audio.play('correcto',() => console.log('ok is done playing'));
        } else {
            this.audio.play('incorrecto',() => console.log('ok is done playing'));
        }

    }

}

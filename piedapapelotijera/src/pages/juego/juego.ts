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

    private mostrar_opciones;
    private mostrar_resultado;
    private cargando_maquina = false;

    private resultados = {
        'piedra': {
            'piedra': 0,
            'papel': -1,
            'tijera': 1
        },
        'papel': {
            'piedra': 1,
            'papel': 0,
            'tijera': -1
        },
        'tijera' : {
            'piedra': -1,
            'papel': 1,
            'tijera': 0
        }
    };

    constructor(public navCtrl: NavController, private param : NavParams, private vibration: Vibration, af: AngularFire, private nativeAudio: NativeAudio) {

        // conecto con la base de datos Firebase.
        this.usuarios = af.database.list('/piedrapapelotijera/usuarios');

        this.usuario = {
            nombre: typeof param.data == "string" ? param.data  : 'Nombre de usuario',
            fecha_creacion: this.getFechaActual()
        };

        /* Cargo los audios */
        this.audio = nativeAudio;

        this.vibration = vibration;

        this.inicializar();
        this.comenzarJuego();
    }

    getFechaActual() {
        let d = new Date();
        let day = d.getDate().toString();
        let month = d.getMonth().toString();
        let year =  d.getFullYear().toString();
        let hour = d.getHours().toString();
        let minutes = d.getMinutes().toString();
        let seconds = d.getSeconds().toString();

        day = day.length < 2 ? '0'+day : day;
        month = month.length < 2? '0'+month : month;
        hour = hour.length < 2 ? '0'+hour : hour;
        minutes = minutes.length < 2 ? '0'+minutes : minutes;
        seconds = seconds.length < 2 ? '0'+seconds : seconds;

        return day+'/'+month+'/'+year+' '+hour+':'+minutes+':'+seconds;
    }

    inicializar() {
        // Cargo los audios
        this.audio.preloadSimple('correcto', 'assets/audios/correcto.mp3');
        this.audio.preloadSimple('incorrecto', 'assets/audios/incorrecto.mp3');
        this.audio.preloadSimple('empate', 'assets/audios/empate.mp3');

        this.mostrar_opciones = false;
        this.mostrar_resultado = false;
        this.usuario.jugador = null;
        this.usuario.maquina = null;
    }

    comenzarJuego() {

        this.mostrarOpciones();

    }

    elegir(eleccion) {

        this.usuario.jugador = eleccion;
        this.mostrar_opciones = false;
        this.mostrarEleccionMaquina();

    }

    mostrarEleccionMaquina() {
        this.usuario.maquina = this.generarEleccionMaquina();
        this.mostrar_resultado = true;
        this.usuario.resultado = this.calcularResultado(this.usuario.jugador, this.usuario.maquina);

        this.cargando_maquina = true;
        setTimeout(() => {
            this.cargando_maquina = false;
            this.emitirResultado(this.usuario.resultado);
            this.vibrarResultado(this.usuario.resultado);
        }, 2000);

        this.guardarUsuario(this.usuario);
    }

    generarEleccionMaquina() {
        let opciones = ['piedra', 'papel', 'tijera'];
        let eleccion = opciones[this.getRandomInt(0, 2)];
        return eleccion;
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    calcularResultado(jugador, maquina) {

        return this.resultados[jugador][maquina];

    }

    emitirResultado(resultado) {

        if (resultado == -1) {
            this.audio.play('incorrecto',() => console.log('ok is done playing'));
        } else if (resultado == 1) {
            this.audio.play('correcto',() => console.log('ok is done playing'));
        } else {
            this.audio.play('empate',() => console.log('ok is done playing'));
        }

    }

    vibrarResultado(resultado) {

        if (resultado == -1) {
            this.vibrating = true;
            this.vibration.vibrate([400,400,400]);
            this.vibrating = false;
        } else if (resultado == 1) {
            this.vibrating = true;
            this.vibration.vibrate(400);
            this.vibrating = false;
        }

    }

    /**
     * Funcion para mostrar las opciones del jugador (piedra, papel o tijera)
     * @return {[type]} [description]
     */
    mostrarOpciones() {

        this.mostrar_opciones = true;

    }

    finalizar() {
        this.irAlLogin();
    }

    guardarUsuario(usuario) {
        this.usuarios.push(usuario);
    }

    irAlLogin() {
        this.navCtrl.setRoot(LoginPage);
    }

}

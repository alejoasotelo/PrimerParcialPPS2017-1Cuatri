import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Vibration } from '@ionic-native/vibration';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { LoginPage } from '../login/login';

@Component({
    selector: 'page-juego',
    templateUrl: 'juego.html'
})

export class JuegoPage {

    private MAX_PREGUNTAS = 3;
    private vibrating : boolean = false;

    private usuario;

    private preguntas: Array<object> = [
        {
            pregunta: 'Quien hizo un gol con la mano en el mundial del 86 a los Ingleses?',
            posibles_respuestas: [
                'Batistuta',
                'Diego Armando Maradona',
                'Eschiavi'
            ],
            respuesta: 1
        },
        {
            pregunta: 'Quien hizo un gol pasandose a todos en el mundial del 86 a los Ingleses?',
            posibles_respuestas: [
                'Valdano',
                'Burruchaga',
                'Diego Armando Maradona',
            ],
            respuesta: 2
        },
        {
            pregunta: 'Contra quien se consagro campeon del mundial 86 la seleccion Argentina?',
            posibles_respuestas: [
                'Inglaterra',
                'Alemania',
                'Mexico',
            ],
            respuesta: 1
        }
    ];

    private respuestas;

    private paso : number;
    private pregunta_actual : object;
    private preguntas_respondidas : Array<number>; // Guarda los indices del array de las preguntas respondidas.

    private mostrar_finalizar = false;
    private mostrar_siguiente = false;
    private es_respuesta_correcta = false;

    private usuarios : FirebaseListObservable<any[]>;

    constructor(public navCtrl: NavController, private param : NavParams, private vibration: Vibration, af: AngularFire) {
        console.log(param.data);

        // conecto con la base de datos Firebase.
        this.usuarios = af.database.list('/usuarios');

        this.usuario = {
            nombre: param.data
        };

        /*this.vibration = vibration;
        this.items = af.database.list('/preguntas');*/
        this.inicializar();
        this.mostrarSiguientePregunta();
    }

    inicializar() {
        this.paso = 0;
        this.pregunta_actual = null;
        this.preguntas_respondidas = [];
        this.respuestas = [];

        this.mostrar_siguiente = false;
        this.es_respuesta_correcta = false;
        this.mostrar_finalizar = false;
    }

    mostrarSiguientePregunta() {

        if (this.paso >= this.MAX_PREGUNTAS) {
            this.mostrar_finalizar = true;
        } else {
            this.mostrar_siguiente = false;
            this.pregunta_actual = this.obtenerPregunta();
            this.paso++;
        }
    }

    obtenerPregunta() : object {

        // Si ya estan todas las preguntas hechas devuelvo null
        if (this.preguntas_respondidas.length == this.MAX_PREGUNTAS) {
            return null;
        }

        let pregunta = null;
        let j = 0;
        while (pregunta == null && j < this.preguntas.length)
        {
            let i = this.getRandomInt(0, 2);

            // Si la pregunta no se respondio entro
            if (this.preguntas_respondidas.indexOf(i) == -1) {
                this.preguntas_respondidas.push(i);
                pregunta = this.preguntas[i];
            }

            j++;
        }

        console.log(pregunta);

        return pregunta;
    }

    responder(index_respuesta, es_correcta) : boolean {

        if (this.mostrar_siguiente) {
            return false;
        }

        let respuesta = {pregunta: this.pregunta_actual, respuesta: index_respuesta, es_correcta: es_correcta};

        console.log(respuesta);
        this.respuestas.push(respuesta);

        this.mostrar_siguiente = true;
        this.es_respuesta_correcta = es_correcta;

        return true;
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max + 1 - min)) + min;
    }

    finalizar() {
        this.usuario.respuestas = this.respuestas;
        let d = new Date();
        this.usuario.fecha_creacion = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getMinutes();
        this.guardarUsuario(this.usuario);
        this.irAlLogin();
    }

    guardarUsuario(usuario) {
        console.log(usuario);
        this.usuarios.push(usuario);
    }

    irAlLogin() {
        this.navCtrl.setRoot(LoginPage);
    }



    toggleVibrator(): void {
        this.vibrating = true;
        this.vibration.vibrate(1000);
        this.vibration.vibrate(0);
        this.vibrating = false;
    }

}

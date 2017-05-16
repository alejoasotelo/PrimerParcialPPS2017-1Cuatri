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

    private clicked = [false, false, false];

    private respuestas;

    private paso : number;
    private pregunta_actual : object;
    private preguntas_respondidas : Array<object>; // Guarda los indices del array de las preguntas respondidas.

    private mostrar_finalizar = false;
    private mostrar_siguiente = false;
    private es_respuesta_correcta = false;

    private usuarios : FirebaseListObservable<any[]>;

    private audio : NativeAudio;

    constructor(public navCtrl: NavController, private param : NavParams, private vibration: Vibration, af: AngularFire, private nativeAudio: NativeAudio) {
        console.log(param.data);

        // conecto con la base de datos Firebase.
        this.usuarios = af.database.list('/usuarios');

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

        this.preguntas = this.randomArray(this.preguntas);
    }

    mostrarSiguientePregunta() {

        for(let i =0; i < this.clicked.length; i++) {
            this.clicked[i] = false;
        }

        if (this.paso >= this.MAX_PREGUNTAS) {
            this.mostrar_finalizar = true;
            // Guardo los resultados.
            this.usuario.respuestas = this.respuestas;
            this.guardarUsuario(this.usuario);
        } else {
            this.mostrar_siguiente = false;
            this.pregunta_actual = this.obtenerPregunta();
            this.preguntas_respondidas.push(this.pregunta_actual);
            this.paso++;
        }
    }

    obtenerPregunta() : object {
        let pregunta = this.preguntas[this.paso];
        return pregunta;
    }

    /**
     * Funcion para desordenar un array
     * @param  Array array
     * @return Array       Devuelve el array desordenado
     */
    private randomArray(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    responder(index_respuesta, es_correcta) : boolean {

        if (this.mostrar_siguiente) {
            return false;
        }

        this.clicked[index_respuesta] = true;

        this.vibrar(es_correcta);
        this.emitirSonido(es_correcta);

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

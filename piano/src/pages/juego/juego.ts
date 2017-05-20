import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { Vibration } from '@ionic-native/vibration';
import { File } from '@ionic-native/file';
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

    private botones = [
        'gato', 'caballo', 'gallo', 'pato', 'perro', 'rana'
    ]

    private historial;
    private file: File;

    constructor(public navCtrl: NavController, private param : NavParams, private vibration: Vibration, af: AngularFire, private nativeAudio: NativeAudio, private files: File, private alertCtrl: AlertController) {

        // conecto con la base de datos Firebase.
        this.usuarios = af.database.list('/piano/usuarios');

        this.usuario = {
            nombre: typeof param.data == "string" ? param.data  : 'Nombre de usuario',
            fecha_creacion: this.getFechaActual(),
            invert_time: Number.MAX_SAFE_INTEGER - Date.now()
        };

        this.file = files;

        /* Cargo los audios */
        this.audio = nativeAudio;

        this.vibration = vibration;

        console.log('Directorios');
        console.info(this.file);
        console.info(this.file.dataDirectory);

        this.inicializar();
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
        this.audio.preloadSimple('caballo', 'assets/audios/caballo.mp3').then(_ => {}).catch(err => {});
        this.audio.preloadSimple('gallo', 'assets/audios/gallo.mp3').then(_ => {}).catch(err => {});
        this.audio.preloadSimple('gato', 'assets/audios/gato.mp3').then(_ => {}).catch(err => {});
        this.audio.preloadSimple('pato', 'assets/audios/pato.mp3').then(_ => {}).catch(err => {});
        this.audio.preloadSimple('perro', 'assets/audios/perro.mp3').then(_ => {}).catch(err => {});
        this.audio.preloadSimple('rana', 'assets/audios/rana.mp3').then(_ => {}).catch(err => {});

        this.usuario.melodia = null;
        this.historial = new Array();
    }

    click(id) {
        this.historial.push({id: id, fecha: this.getFechaActual(), time: (new Date()).getTime()});
        this.emitirSonido(id);
        this.vibrar();
    }

    emitirSonido(id) {
        try{
            this.audio.play(id, () => console.log('ok is done playing'));
        } catch(e) {
            console.log('emitirSonido. Exception: ' + e);
        }
    }

    vibrar() {
        this.vibrating = true;
        this.vibration.vibrate(200);
        this.vibrating = false;
    }

    finalizar() {
        this.usuario.historial = this.historial;
        this.guardarUsuario(this.usuario);
        this.guardarMelodia(this.usuario.historial);
        this.irAlLogin();
    }

    guardarUsuario(usuario) {
        this.usuarios.push(usuario);
    }

    guardarMelodia(melodia) {

        this.file.checkFile(this.file.dataDirectory, 'melodia.txt').then(_ => {
            console.log('Existe el archivo: melodia.txt');

            this.file.removeFile(this.file.dataDirectory, 'melodia.txt').then(_ => {
                console.log('Archivo eliminado');

                this.file.writeFile(this.file.dataDirectory, 'melodia.txt', JSON.stringify(melodia)).then(_ => {

                    this.file.readAsBinaryString(this.file.dataDirectory, 'melodia.txt').then(data => {

                        let melodias = JSON.parse(data);
                        console.log('melodias');
                        console.log(melodias);
                    });


                }).catch(err => {

                    console.log('errpiano');
                    console.log(err);

                });
            }).catch(err => {
                console.log('Archivo no encontrado')
            });

        }).catch(err => {
            console.log('No existe el archivo');
            console.log(err);

            this.file.writeFile(this.file.dataDirectory, 'melodia.txt', JSON.stringify(melodia)).then(_ => {

                this.file.readAsBinaryString(this.file.dataDirectory, 'melodia.txt').then(data => {

                    let melodias = JSON.parse(data);
                    console.log('melodias');
                    console.log(melodias);
                });

            }).catch(err => {

                console.log('errpiano2');
                console.log(err);

            });
        });

    }

    irAlLogin() {
        this.navCtrl.setRoot(LoginPage);
    }

}

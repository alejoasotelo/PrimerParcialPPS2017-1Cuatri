import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { NativeAudio } from '@ionic-native/native-audio';

@Component({
    selector: 'page-resultados',
    templateUrl: 'resultados.html'
})
export class ResultadosPage {

    private usuarios : FirebaseListObservable<any[]>;

    private filtro = 1;
    private af;

    private cargando_usuarios = false;
    private esta_tardando = false;
    private error;
    private audio : NativeAudio;

    constructor(public navCtrl: NavController, af: AngularFire, private nativeAudio: NativeAudio) {

        this.af = af;
        this.audio = nativeAudio;

        this.cargando_usuarios = true;

        let self = this;

        this.usuarios = af.database.list('/piano/usuarios', {
            query: {
                limitToLast: 10,
                orderByChild: 'invert_time'
            }
        })

        let s = this;
        let timeid = setTimeout(_ => {
            s.esta_tardando = true;
        }, 20000);

        this.usuarios.subscribe(
            function (x) {
                clearTimeout(timeid);
                self.cargando_usuarios = false;
                s.esta_tardando = false;
                console.log('onNext: %s', x);
            },
            function (e) {
                clearTimeout(timeid);
                self.cargando_usuarios = false;
                s.esta_tardando = false;
                self.error = e;
                console.log('onError: %s', e);
            }
        );

        this.inicializar();

    }

    inicializar() {
        // Cargo los audios
        this.audio.preloadSimple('caballo', 'assets/audios/caballo.mp3').then(_ => {}).catch(err => {});
        this.audio.preloadSimple('gallo', 'assets/audios/gallo.mp3').then(_ => {}).catch(err => {});
        this.audio.preloadSimple('gato', 'assets/audios/gato.mp3').then(_ => {}).catch(err => {});
        this.audio.preloadSimple('pato', 'assets/audios/pato.mp3').then(_ => {}).catch(err => {});
        this.audio.preloadSimple('perro', 'assets/audios/perro.mp3').then(_ => {}).catch(err => {});
        this.audio.preloadSimple('rana', 'assets/audios/rana.mp3').then(_ => {}).catch(err => {});
    }

    reproducir(melodia) {
        let i = melodia.length > 3 ? melodia.length - 3 : 0;
        this.tocarNota(melodia, i);
    }

    tocarNota(melodia, i) {

        if (melodia[i]) {
            let nota = melodia[i];
            this.audio.play(nota.id);
            let s = this;
            setTimeout(_ => {
                s.tocarNota(melodia, ++i);
            }, 800);
        }

    }

}

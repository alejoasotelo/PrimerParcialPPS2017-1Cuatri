import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ResultadosPage } from '../pages/resultados/resultados';
import { ContactPage } from '../pages/contact/contact';
import { JuegoPage } from '../pages/juego/juego';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Vibration } from '@ionic-native/vibration';
import { NativeAudio } from '@ionic-native/native-audio';

import { AngularFireModule } from 'angularfire2';

export const firebaseConfig = {
  apiKey: "AIzaSyCJvCVb58S2C2VwpX6y3XIKikya3phvUJo",
  authDomain: "trivia-proyecto17.firebaseapp.com",
  databaseURL: "https://trivia-proyecto17.firebaseio.com/",
  storageBucket: "trivia-proyecto17.appspot.com"
};

@NgModule({
  declarations: [
    MyApp,
    ResultadosPage,
    ContactPage,
    LoginPage,
    JuegoPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ResultadosPage,
    ContactPage,
    JuegoPage,
    LoginPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Vibration,
    NativeAudio,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

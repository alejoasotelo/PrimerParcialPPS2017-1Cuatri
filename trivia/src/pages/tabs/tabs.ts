import { Component } from '@angular/core';

import { ResultadosPage } from '../resultados/resultados';
import { ContactPage } from '../contact/contact';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = LoginPage;
  tab2Root = ResultadosPage;
  tab3Root = ContactPage;

  constructor() {

      console.log(this);

  }
}

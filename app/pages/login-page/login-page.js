import { CellsPage } from "@cells/cells-page";
import { html, css } from "lit-element";
import "@cells-components/cells-template-paper-drawer-panel";
import "@bbva-web-components/bbva-header-main";
import '@vaadin/vaadin-login';


class LoginPage extends CellsPage {
  static get is() {
    return "login-page";
  }

  constructor() {
    super();
    this.headerTitle = "This the home page!";
  }

  static get properties() {
    return {
      headerTitle: { type: String },
    };
  }

  onPageEnter() {
    console.log("Page loaded");
    var vaadinLoginOverlay = this.shadowRoot.querySelector('vaadin-login-overlay');
    var feedbackDialog = this.shadowRoot.querySelector('#feedbackDialog');
    var supportDialog = this.shadowRoot.querySelector('#supportDialog');

    var i18n = Object.assign(
      {},
      vaadinLoginOverlay.i18n,
      {
        header: {
          title: 'Cotizalo!',
          description: 'Realiza tus cotizaciones en linea !'
        },
        form: {
          title: 'Accede',
          username: 'Usuario',
          password: 'Contraseña',
          submit: 'Enviar',
          forgotPassword: 'Olvido su Contraseña'
        },
        errorMessage: {
          title: 'Datos inconrrectos',
          message: 'Verifique sus credenciales e intentelo de nuevo.'
        },
        additionalInformation: 'Aplicacion Fake para Universidad Javeriana'
      }
    );

    vaadinLoginOverlay.i18n = i18n;

    vaadinLoginOverlay.addEventListener('login', (e) => {
      feedbackDialog.opened = true;
      var detail = e.detail,
        username = detail.username,
        password = detail.password;
      setTimeout(() =>  {
        feedbackDialog.opened = false;
        if (username === 'admin' && password === 'admin') {
          this.navigate("another", {});
          vaadinLoginOverlay.opened = false;
        } else {
          vaadinLoginOverlay.error = true;
        }
      }, 1000);
    });

  }

  onPageLeave() {
    console.log("Page unloaded");
  }


  render() {
    return html` <cells-template-paper-drawer-panel mode="seamed">
      <div slot="app__overlay"></div>

      <div slot="app__main" class="container">
        <vaadin-login-overlay opened></vaadin-login-overlay>
        <vaadin-dialog id="feedbackDialog">
          <template>Login is being processed...</template>
        </vaadin-dialog>
        <vaadin-dialog id="supportDialog">
          <template>Please contact support.</template>
        </vaadin-dialog>
      </div>
    </cells-template-paper-drawer-panel>`;
  }

  static get styles() {
    return css``;
  }
}

window.customElements.define(LoginPage.is, LoginPage);

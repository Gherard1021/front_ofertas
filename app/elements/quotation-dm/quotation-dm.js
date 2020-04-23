import { LitElement } from 'lit-element';

export class QuotationDm extends LitElement {
  static get properties() {
    return {
      host : String,
      name: String,
      email: String,
      items: Array
    };

  }

  constructor() {
    super();
    this.host = 'http://34.70.156.253:8080/api/quotation'

  }

  sendQuotation() {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var myBody = {
        "customerName": this.name,
        "email": this.email,
        "products": this.items
    };
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(myBody)
    };

    fetch(this.host + "/create-quotation", requestOptions)
      .then(response => {
        return response.json();
      })
      .then(result => {
        this.dispatchEvent(new CustomEvent('quotation-dm-success', {
          detail: {
            id: result.id
          }
        }));
        console.log(result);
      })
      .catch(error => {
        console.log("Error crear cotizacion: ", +error)
      });
  }

}
customElements.define('quotation-dm', QuotationDm);

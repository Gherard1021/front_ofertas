import { LitElement } from 'lit-element';

export class ProductsDm extends LitElement {

static get properties() {
  return {
    host : String,
    categories : Array
  };

}

constructor() {
  super();
  this.host = 'http://34.70.156.253:8080/api'
}


getCategories() {
  fetch(this.host + '/categories/')
    .then(response => response.json())
    .then(data => {
      this.categories = data._embedded.categories;
      this.dispatchEvent(new CustomEvent('categories-dm-success', {
        detail: this.categories
      }));
    })
    .catch(error => {
      console.log("Error get Categories: ", +error)
      this.dispatchEvent(new CustomEvent('categories-dm-error'));
    });
}

getProducts(categorie) {
  let url = this.categories.find( el => el.name == categorie)
  url = url._links.products.href;
  fetch(url)
  .then(response => response.json())
  .then(data => {
      this.dispatchEvent(new CustomEvent('products-dm-success', {
        detail: data._embedded.products
      }));
  })
  .catch(error => {
    console.log("Error get Categories: ", +error)
    this.dispatchEvent(new CustomEvent('products-dm-error'));
  });
}

getProviderProducts(products) {
  return products.map((product) => {
    let p = {};
    this.getProviderProduct(product)
    .then(res => p = res);
    return p;
  })
}

getProviderByProduct(p) {
    let url = p._links.provider.href;
    let idProduct = '';
    fetch(url)
    .then(response => {
      idProduct = response.url;
      return response.json();
    })
    .then(data =>  {
      this.dispatchEvent(new CustomEvent('product-with-provider-success', {
          detail: {
            detail: data.content,
            url: idProduct
          }
      }));
    })
}

 async callProvider(url) {
   const response = await fetch(url);
   const provider = await response.json();
  return provider.content;
}

}
customElements.define('products-dm', ProductsDm);

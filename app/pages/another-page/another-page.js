import {CellsPage} from '@cells/cells-page';
import {html, css} from 'lit-element';
import '@cells-components/cells-template-paper-drawer-panel';
import '@bbva-web-components/bbva-header-main';
import '@vaadin/vaadin-form-layout';
import '@vaadin/vaadin-date-picker';
import '@vaadin/vaadin-combo-box';
import '@vaadin/vaadin-grid-pro';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column';
import '@vaadin/vaadin-grid-pro/vaadin-grid-pro-edit-column';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-item';
import '@vaadin/vaadin-dialog';
import '../../elements/products-dm/products-dm.js';
import '../../elements/quotation-dm/quotation-dm.js';


class AnotherPage extends CellsPage {
  static get is() {
    return 'another-page';
  }

  static get properties() {
    return {
      itemsCategoryitems: Array,
      itemsProducts: Object,
      name: String,
      email: String,
      itemsSelected: Array
    };
  }

  constructor() {
    super();
    this.itemsCategory = [];
    this.itemsProducts = [];
    this.itemsSelected = [];
  }

  onPageEnter() {
    this.getCategories();
  }

  reloadCategories() {
    this.getCategories();
  }

  loadCategories(e) {
    let combo = this.shadowRoot.querySelector('vaadin-combo-box');
    let categoriesNames = [];
    for(const categorie in e.detail) {
      categoriesNames.push(e.detail[categorie].name);
    }
    combo.items =categoriesNames;
  }

  loadProducts(e) {
    let table = this.shadowRoot.querySelector('vaadin-grid-pro');
    table.querySelector('[path="cant"]').editorOptions = this.returnNumbers();
    this.itemsProducts = this.normalizeProductswithOutProvider(e.detail);
    this.normalizeProductsData(e.detail);

    setTimeout(() => {
      table.items = this.itemsProducts;
    }, 500);

  }

  loadProductswithProvider(e) {
    this.itemsProducts = this.itemsProducts.map( p => {
      if(p.idProvider === e.detail.url.substring(e.detail.url.length-11, e.detail.url.length - 9)) {
        p.prov = e.detail.detail.name
      }
      return p;
    });
  }

  normalizeProductswithOutProvider(products) {
    return products.map( p => {
       return {
        'product': p.name,
        'prov': '',
        'cant': 1,
        'idProvider': p._links.self.href.substring(p._links.self.href.length -2)
       }
    });
  }

  normalizeProductsData(products) {
    let dm = this.shadowRoot.querySelector('#productsDM');
    return products.map( p => {
      dm.getProviderByProduct(p);
    });
  }

  returnNumbers() {
    let options = [];
    let n = 1;
    while (n<=100) {
      options.push(n);
      n +=1
      ;
    }
    return options;
  }

  getCategories() {
    let dm = this.shadowRoot.querySelector('#productsDM');
    dm.getCategories();
  }

  categorieSelected(e) {
    const categorySelected = e.detail.value;
    let dm = this.shadowRoot.querySelector('#productsDM');
    dm.getProducts(categorySelected);
  }



  sendQuotation() {
    let name = this.shadowRoot.querySelector('#txtName').value;
    let email = this.shadowRoot.querySelector('#txtEmail').value;
    let dm = this.shadowRoot.querySelector('#quotationDM');
    dm.name = name;
    dm.email = email;
    this.itemsSelected = this.itemsSelected.map( item => {
      return {
          productName: item.product,
          quantity: item.cant
      };
    })
    dm.items = this.itemsSelected;
    dm.sendQuotation();
  }

  openDialog() {
    this.selectedItems() ;
    if( this.itemsSelected.length === 0) {
        const dialog = this.shadowRoot.querySelector('vaadin-dialog');
        dialog.renderer = (root, dialog) =>  {
        const div = window.document.createElement('div');
        div.textContent = 'Debe agregar productos a su cotización';

        const br = window.document.createElement('br');

        const okButton = window.document.createElement('vaadin-button');
        okButton.setAttribute('theme', 'primary');
        okButton.textContent = 'Aceptar';
        okButton.setAttribute('style', 'margin-right: 1em');
        okButton.addEventListener('click', () => {
          dialog.opened = false;
        });

        root.appendChild(div);
        root.appendChild(br);
        root.appendChild(okButton);
      };
        dialog.opened = true;
    } else {
      const dialog = this.shadowRoot.querySelector('vaadin-dialog');
      dialog.renderer = (root, dialog) =>  {
        const div = window.document.createElement('div');
        div.setAttribute('id', 'dialogText');
        div.textContent = 'Desea enviar la cotización?';

        const br = window.document.createElement('br');

        const okButton = window.document.createElement('vaadin-button');
        okButton.setAttribute('theme', 'primary');
        okButton.textContent = 'Enviar';
        okButton.setAttribute('style', 'margin-right: 1em');
        okButton.addEventListener('click', () => {
          this.sendQuotation();
          dialog.opened = false;
        });

        const cancelButton = window.document.createElement('vaadin-button');
        cancelButton.textContent = 'Cancelar';
        cancelButton.addEventListener('click', () => {
          dialog.opened = false;
        });

        root.appendChild(div);
        root.appendChild(br);
        root.appendChild(okButton);
        root.appendChild(cancelButton);
      };
        dialog.opened = true;
    }
  }

  confirmQuotation(e) {
    const dialog = this.shadowRoot.querySelector('vaadin-dialog');
    dialog.renderer = (root, dialog) =>  {
    const div = window.document.createElement('div');
    div.textContent = 'Su cotización se ha registrado bajo el consecutivo:  ' + e.detail.id + '. En breve recibirá un correo electrónico con las ofertas de los proveedores';

    const br = window.document.createElement('br');

    const okButton = window.document.createElement('vaadin-button');
    okButton.setAttribute('theme', 'primary');
    okButton.textContent = 'Aceptar';
    okButton.setAttribute('style', 'margin-right: 1em');
    okButton.addEventListener('click', () => {
      dialog.opened = false;
      location.reload();
    });

    root.appendChild(div);
    root.appendChild(br);
    root.appendChild(okButton);
  };
    dialog.opened = true;
  }

  selectedItems() {
    let table = this.shadowRoot.querySelector('vaadin-grid-pro');
    this.itemsSelected = table.selectedItems;
  }

  render() {
    return html`
      <cells-template-paper-drawer-panel mode="seamed">
        <div slot="app__header">
          <bbva-header-main
            class="header"
            text="COTIZA TUS PRODUCTOS">
          </bbva-header-main>
        </div>

        <div slot="app__main" class="container">
        <vaadin-form-layout>
          <vaadin-text-field id="txtName" label="Nombre" placeholder="Jane"></vaadin-text-field>
          <vaadin-text-field label="Apellido" placeholder="Doe"></vaadin-text-field>
          <vaadin-text-field id="txtEmail" label="Email" placeholder="jane.doe@example.com"></vaadin-text-field>
          <vaadin-date-picker label="Fecha de entrega" placeholder="1993-06-23"></vaadin-date-picker>
          <vaadin-combo-box @selected-item-changed=${this.categorieSelected} label="Categoría" placeholder="Celulares y teléfonos" colspan="2"></vaadin-combo-box>
        </vaadin-form-layout>
        <p class="title">Selecciona los productos de tu cotización</p>
        <div class="list-products">
          <vaadin-grid-pro overflow="bottom top">
            <vaadin-grid-selection-column></vaadin-grid-selection-column>
            <vaadin-grid-filter-column path="product" header="Producto" theme="small"></vaadin-grid-filter-column>
            <vaadin-grid-filter-column path="prov" header="Proveedor" theme="small"></vaadin-grid-filter-column>
            <vaadin-grid-pro-edit-column path="cant" header="Cantidad" editor-type="select"></vaadin-grid-pro-edit-column>
          </vaadin-grid-pro>
          <div class="confirm-button">
            <vaadin-button @click=${this.openDialog} theme="primary">Agregar productos</vaadin-button>
          </div>
          <vaadin-dialog no-close-on-esc no-close-on-outside-click>
          </vaadin-dialog>
       </div>
       <div slot="app__overlay" class="container">
         <products-dm id="productsDM"
            @categories-dm-success = ${this.loadCategories}
            @categories-dm-error = ${this.reloadCategories}
            @products-dm-success = ${this.loadProducts}
            @product-with-provider-success = ${this.loadProductswithProvider}
          ></products-dm>
          <quotation-dm id="quotationDM"
            @quotation-dm-success = ${this.confirmQuotation}>
          </quotation-dm>
      </div>
    </cells-template-paper-drawer-panel>`;
  }

  static get styles() {
    return css`

      .container {
        margin: 20px;
      }

      bbva-header-main {
        --bbva-header-main-bg-color: #1576f3;
      }
      .header {
        background-color: #1464A5;
      }

      .list-products {
        display: block;
        padding: 1.5em;
      }

      .title {
        text-align: center;
        margin-top: 3rem;
        font-size: larger;
        font-weight: 600;
      }

      vaadin-grid-pro {
        max-height: 300px;
      }

      .confirm-button {
        text-align: center;
        margin: 20px;
      }
    `;
  }
}

window.customElements.define(AnotherPage.is, AnotherPage);

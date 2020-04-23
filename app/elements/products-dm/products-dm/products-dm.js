import { LitElement, html, } from 'lit-element';
import { getComponentSharedStyles, } from '@cells-components/cells-lit-helpers/cells-lit-helpers.js';
import styles from './products-dm-styles.js';
/**
This component ...

Example:

```html
<products-dm></products-dm>
```

##styling-doc

@customElement products-dm
@polymer
@LitElement
@demo demo/index.html
*/
export class ProductsDm extends LitElement {
  static get is() {
    return 'products-dm';
  }

  // Declare properties
  static get properties() {
    return {
      name: { type: String, },
    };
  }

  // Initialize properties
  constructor() {
    super();
    this.name = 'Cells';
  }

  static get styles() {
    return [
      styles,
      getComponentSharedStyles('products-dm-shared-styles')
    ]
  }

  // Define a template
  render() {
    return html`
      <slot></slot>
      <p>Welcome to ${this.name}</p>
    `;
  }
}

// Register the element with the browser
customElements.define(ProductsDm.is, ProductsDm);

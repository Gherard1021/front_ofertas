import { html, fixture, assert, fixtureCleanup } from '@open-wc/testing';
import '../products-dm.js';

suite('<products-dm>', () => {
  let el;

  teardown(() => fixtureCleanup());

  setup(async () => {
    el = await fixture(html`<products-dm></products-dm>`);
    await el.updateComplete;
  });

  test('instantiating the element with default properties works', () => {
    const element = el.shadowRoot.querySelector('p');
    assert.equal(element.innerText, 'Welcome to Cells');
  });

});






import { css, unsafeCSS } from 'lit-element';


export default css`
:host {
  display: block;
  box-sizing: border-box;
  @apply --products-dm; }

:host([hidden]), [hidden] {
  display: none !important; }

*, *:before, *:after {
  box-sizing: inherit;}
`;

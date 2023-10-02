import { html, css, LitElement, unsafeCSS } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import * as Prism from 'prismjs';
import {encode, decode, resolve, resolveShort} from "did-peer-4";

import 'prismjs/themes/prism.css';
import bulmaStyleString from 'bulma/css/bulma.min.css';
const bulma = css`${unsafeCSS(bulmaStyleString)}`;

@customElement('app-root')
class App extends LitElement {
  static styles = [
    bulma,
    css`
    .container {
      margin-top: 20px;
    }
    `
  ];

  @query("#did") did!: HTMLTextAreaElement;
  @query("#input-doc") inputDoc!: HTMLTextAreaElement;
  longForm = '';
  shortForm = '';

  firstUpdated() {
    const urlParams = new URLSearchParams(window.location.search);
    const didParam = urlParams.get('did');
    if (didParam) {
      this.did.value = didParam;
      this.requestUpdate();
    }
  }

  updated() {
    Prism.highlightAll();
  }

  async resolve(event: Event) {
    if (event.target === this.did) {
      this.inputDoc.value = JSON.stringify(await decode(this.did.value), null, 2);
    }
    if (event.target === this.inputDoc) {
      this.did.value = await encode(JSON.parse(this.inputDoc.value));
    }
    if (this.did?.value) {
      this.longForm = JSON.stringify(await resolve(this.did.value), null, 2);
      this.shortForm = JSON.stringify(await resolveShort(this.did.value), null, 2);
    }
  }

  render() {
    return html`
      <section class="section">
        <div class="container">
          <textarea 
            id="did"
            class="textarea" 
            placeholder="Enter did:peer:4 DID..." 
            @input=${this.resolve}
          ></textarea>

          <textarea 
            id="input-doc"
            class="textarea" 
            placeholder="Enter input document..." 
            @input=${this.resolve}
          ></textarea>

          <pre><code class="language-json">${this.longForm}</code></pre>
          <pre><code class="language-json">${this.shortForm}</code></pre>
        </div>
      </section>
    `;
  }
}

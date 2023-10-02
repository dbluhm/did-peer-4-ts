import { html, css, LitElement } from 'lit';
import 'bulma/css/bulma.min.css';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

class App extends LitElement {
    static styles = css`
        .container {
            margin-top: 20px;
        }
    `;

    did = '';
    inputDoc = '';
    longForm = '';
    shortForm = '';

    firstUpdated() {
        const urlParams = new URLSearchParams(window.location.search);
        const didParam = urlParams.get('did');
        if (didParam) {
            this.did = didParam;
            this.requestUpdate();
        }
    }

    updated() {
        Prism.highlightAll();
    }

    // You will integrate the DID processing logic here...

    render() {
        return html`
            <section class="section">
                <div class="container">
                    <textarea 
                        class="textarea" 
                        placeholder="Enter did:peer:4 DID..." 
                        .value=${this.did}
                        @input=${(e: InputEvent) => {
                            this.did = (e.target as HTMLTextAreaElement).value;
                            this.requestUpdate();
                        }}
                    ></textarea>

                    <textarea 
                        class="textarea" 
                        placeholder="Enter input document..." 
                        .value=${this.inputDoc}
                        @input=${(e: InputEvent) => {
                            this.inputDoc = (e.target as HTMLTextAreaElement).value;
                            this.requestUpdate();
                        }}
                    ></textarea>

                    <pre><code class="language-json">${this.longForm}</code></pre>
                    <pre><code class="language-json">${this.shortForm}</code></pre>
                </div>
            </section>
        `;
    }
}

customElements.define('app-root', App);

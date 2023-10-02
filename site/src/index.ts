import * as m from "mithril"
import {encode, decode, resolve, resolveShort} from "did-peer-4"
import JSONEditor from "./json-editor"
import * as Prism from "prismjs"

import "bulma/css/bulma.css"
import "@fortawesome/fontawesome-free/css/all.css"
import "prismjs/themes/prism.css"
import "prismjs/components/prism-json"

import "./index.css"

const SPEC = "https://identity.foundation/peer-did-method-spec/index.html"
const GITHUB = "https://github.com/dbluhm/did-peer-4-ts"

class App implements m.ClassComponent {
  did: string = ""
  inputDoc: string = ""
  longForm: string = ""
  shortForm: string = ""
  errorMessage: string = ""

  didTimeout: number | null = null
  docTimeout: number | null = null

  oninit(vnode: m.Vnode) {
    const urlParams = new URLSearchParams(window.location.search);
    const didParam = urlParams.get('did');
    if (didParam) {
      this.did = didParam;
      this.updateFromDID()
    }
  }

  async updateFromDID() {
    if (!this.did) {
      this.errorMessage = ""
      return
    }
    try {
      this.inputDoc = JSON.stringify(await decode(this.did), null, 2)
      this.longForm = JSON.stringify(await resolve(this.did), null, 2)
      this.shortForm = JSON.stringify(await resolveShort(this.did), null, 2)
      this.errorMessage = ""
    } catch(e) {
      this.errorMessage = e.message || "Error resolving DID."
    }
    Prism.highlightAll()
    m.redraw()
  }

  async updateFromDoc() {
    if (!this.inputDoc) {
      this.errorMessage = ""
      return
    }
    try {
      this.did = await encode(JSON.parse(this.inputDoc))
      this.longForm = JSON.stringify(await resolve(this.did), null, 2)
      this.shortForm = JSON.stringify(await resolveShort(this.did), null, 2)
      this.errorMessage = ""
    } catch(e) {
      this.errorMessage = e.message || "Error resolving DID."
    }
    Prism.highlightAll()
    m.redraw()
  }

  view(vnode: m.Vnode) {
    return m("main", [
      m("nav.navbar.is-info", [
        m("div.navbar-brand", [
          m("h1#brand", "did:peer:4"),
        ]),
        m(".navbar-end", [
          m("a.navbar-item", { href: SPEC, target: "_blank" }, "Specification"),
          m("a.navbar-item", { href: GITHUB, target: "_blank" }, "Github")
        ])
      ]),
      m("div.container", [
        this.errorMessage && m("div.notification.is-danger", this.errorMessage),
        m(".columns", [
          m(".column.is-half",
            m("div.field", [
              m("label.label", "DID Input"),
              m("div.control", 
                m("textarea#did.textarea", {
                  value: this.did,
                  oninput: (e: Event) => {
                    this.did = (e.target as HTMLTextAreaElement).value;
                    if (this.didTimeout) {
                      clearTimeout(this.didTimeout);
                    }
                    this.didTimeout = setTimeout(() => this.updateFromDID(), 500) as any;
                  }
                })
               )
            ])
           ),
           m(".column.is-half",
             m("div.field", [
               m("label.label", "Input Document"),
               m("div.control", 
                 m(JSONEditor, {
                   id: "input-doc",
                   content: this.inputDoc,
                   changed: ({detail: code}) => {
                     console.log("changed called")
                     this.inputDoc = code
                     if (this.docTimeout) {
                       clearTimeout(this.docTimeout)
                     }
                     this.docTimeout = setTimeout(() => this.updateFromDoc(), 500) as any
                   }
                 })
                )
             ]),
            )
        ]),
        m("div.field", [
          m("label.label", "Resolved Long Form"),
          m("pre",
            m("code", {
              class: "language-json",
            }, this.longForm)
           )
        ]),
        m("div.field", [
          m("label.label", "Resolved Short Form"),
          m("pre",
            m("code", {
              class: "language-json",
            }, this.shortForm)
           )
        ])
      ])
    ])
  }
}

m.route(document.body, "/", {
  "/": App
})

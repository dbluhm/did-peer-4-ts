import * as m from "mithril"
import { encode, decode, resolve, resolveShort, encodeShort } from "did-peer-4"
import JSONEditor from "./json-editor"
import CopyButton from "./copy-button"
import LinkButton from "./link-button"
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
  short: string = ""
  inputDoc: string = ""
  longForm: string = ""
  shortForm: string = ""
  errorMessage: string = ""

  didTimeout: number | null = null
  docTimeout: number | null = null

  oninit(vnode: m.Vnode) {
    const urlParams = new URLSearchParams(window.location.search)
    const didParam = urlParams.get("did")
    if (didParam) {
      this.did = didParam
      this.updateFromDID()
    }
  }

  async updateFromDID() {
    if (!this.did) {
      this.errorMessage = ""
      return
    }
    try {
      let doc = await resolve(this.did)
      this.inputDoc = JSON.stringify(await decode(this.did), null, 2)
      this.short = await encodeShort(doc)
      this.longForm = JSON.stringify(doc, null, 2)
      this.shortForm = JSON.stringify(await resolveShort(this.did), null, 2)
      this.errorMessage = ""
    } catch (e) {
      this.errorMessage = e.message || "Error resolving DID."
    }
    m.redraw()
  }

  async updateFromDoc() {
    if (!this.inputDoc) {
      this.errorMessage = ""
      return
    }
    try {
      let doc = JSON.parse(this.inputDoc)
      this.did = await encode(doc)
      this.short = await encodeShort(doc)
      this.longForm = JSON.stringify(await resolve(this.did), null, 2)
      this.shortForm = JSON.stringify(await resolveShort(this.did), null, 2)
      this.errorMessage = ""
    } catch (e) {
      this.errorMessage = e.message || "Error resolving DID."
    }
    m.redraw()
  }

  private getLinkToDid(did: string): string {
    let url = new URL(window.location.href)
    url.searchParams.set("did", did)
    return url.toString()
  }

  onupdate() {
    const longFormElement = document.querySelector(".long-form-code")
    if (longFormElement) {
      longFormElement.innerHTML = this.longForm
      Prism.highlightElement(longFormElement)
    }

    const shortFormElement = document.querySelector(".short-form-code")
    if (shortFormElement) {
      shortFormElement.innerHTML = this.shortForm
      Prism.highlightElement(shortFormElement)
    }
  }

  view(vnode: m.Vnode) {
    return m("main", [
      m("nav.navbar.is-info", [
        m("div.navbar-brand", [m("h1#brand", "did:peer:4")]),
        m(".navbar-end", [
          m("a.navbar-item", { href: SPEC, target: "_blank" }, "Specification"),
          m("a.navbar-item", { href: GITHUB, target: "_blank" }, "Github"),
        ]),
      ]),
      m("div.container", [
        this.errorMessage && m("div.notification.is-danger", this.errorMessage),
        m(".columns", [
          m(
            ".column.is-half",
            m("div.field", [
              m("div.is-flex.is-justify-content-space-between.is-align-items-center", [
                m(".control", [
                  m("label.label", "DID Input")
                ]),
                m('div', [
                  m(LinkButton, {
                    title: "Copy Link to DID",
                    ref: this.getLinkToDid(this.did),
                  }),
                  m(CopyButton, {
                    title: "Copy DID",
                    content: this.did,
                  })
                ]),
              ]),
              m(
                "div.control",
                m("textarea#did.textarea", {
                  value: this.did,
                  oninput: (e: Event) => {
                    this.did = (e.target as HTMLTextAreaElement).value
                    if (this.didTimeout) {
                      clearTimeout(this.didTimeout)
                    }
                    this.didTimeout = setTimeout(
                      () => this.updateFromDID(),
                      500
                    ) as any
                  },
                })
              ),
            ])
          ),
          m(
            ".column.is-half",
            m("div.field", [
              m("label.label", [
                "Input Document",
                m(CopyButton, {
                  title: "Copy Input Document",
                  content: this.inputDoc,
                }),
              ]),
              m(
                "div.control",
                m(JSONEditor, {
                  id: "input-doc",
                  content: this.inputDoc,
                  changed: ({ detail: code }) => {
                    this.inputDoc = code
                    if (this.docTimeout) {
                      clearTimeout(this.docTimeout)
                    }
                    this.docTimeout = setTimeout(
                      () => this.updateFromDoc(),
                      500
                    ) as any
                  },
                })
              ),
            ])
          ),
        ]),
        m("div.field", [
          m("label.label", [
            "Short Form DID",
            m(CopyButton, {
              title: "Copy Short Form DID",
              content: this.short,
            }),
          ]),
          m("pre#short-form-did", this.short),
        ]),
        m("div.field", [
          m("label.label", [
            "Resolved Long Form",
            m(CopyButton, {
              title: "Copy Resolve Long Form",
              content: this.longForm,
            }),
          ]),
          m("pre", m("code.language-json.long-form-code", {}, this.longForm)),
        ]),
        m("div.field", [
          m("label.label", [
            "Resolved Short Form",
            m(CopyButton, {
              title: "Copy Resolve Short Form",
              content: this.shortForm,
            }),
          ]),
          m("pre", m("code.language-json.short-form-code", {}, this.shortForm)),
        ]),
      ]),
    ])
  }
}

m.route(document.body, "/", {
  "/": App,
})

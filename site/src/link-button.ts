import * as m from "mithril"

class LinkButtonAttributes {
  title: string
  ref: string
}

export default class LinkButton
  implements m.ClassComponent<LinkButtonAttributes>
{
  private title: string
  private ref: string
  private copied: boolean = false

  oninit(vnode: m.Vnode<LinkButtonAttributes, this>) {
    this.ref = vnode.attrs.ref
    this.title = vnode.attrs.title
  }

  onbeforeupdate(
    vnode: m.Vnode<LinkButtonAttributes, this>,
    old: m.VnodeDOM<LinkButtonAttributes, this>
  ) {
    this.ref = vnode.attrs.ref
    return true
  }

  private copyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.copied = true
        m.redraw() // Inform Mithril to redraw the component

        // Reset after some time (e.g., 2 seconds)
        setTimeout(() => {
          this.copied = false
          m.redraw()
        }, 2000)
      })
      .catch(err => {
        console.error("Failed to copy text: ", err)
      })
  }

  view() {
    return m(
      "button.button.is-small.is-white",
      {
        onclick: () => this.copyToClipboard(this.ref),
        class: this.copied ? "is-success" : "",
        title: this.title,
      },
      m(
        "span.icon",
        m("i", {
          class: this.copied ? "fa-solid fa-check" : "fa-solid fa-link",
        })
      )
    )
  }
}

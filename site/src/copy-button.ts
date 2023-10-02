import * as m from "mithril"

class CopyButtonAttributes {
  title: string
  content: string
}

export default class CopyButton implements m.ClassComponent<CopyButtonAttributes> {
  private title: string
  private content: string
  private copied: boolean = false

  oninit(vnode: m.Vnode<CopyButtonAttributes, this>) {
    this.content = vnode.attrs.content
    this.title = vnode.attrs.title
  }

  onbeforeupdate(vnode: m.Vnode<CopyButtonAttributes, this>, old: m.VnodeDOM<CopyButtonAttributes, this>) {
    this.content = vnode.attrs.content;
    return true;
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
      "button.button.is-small.is-white.is-pulled-right",
      {
        onclick: () => this.copyToClipboard(this.content),
        class: this.copied ? "is-success" : "",
        title: this.title,
      },
      m(
        "span.icon",
        m("i", {
          class: this.copied
            ? "fa-solid fa-check"
            : "fa-solid fa-copy",
        })
      )
    )
  }
}

import * as m from "mithril"
import "prismjs"
import "lit-code"

import "prismjs/components/prism-json"
import "prismjs/themes/prism.css"

class JSONEditorAttributes {
  id: string
  content: string
  changed: (e: any) => void
}

export default class JSONEditor
  implements m.ClassComponent<JSONEditorAttributes>
{
  private id: string = ""
  private content: string = ""
  private changed: (e: any) => void

  oninit(vnode: m.Vnode<JSONEditorAttributes>) {
    this.id = vnode.attrs.id
    this.content = vnode.attrs.content
    this.changed = vnode.attrs.changed
  }

  oncreate(vnode: m.VnodeDOM<JSONEditorAttributes>) {
    const editor = vnode.dom as any
    editor.setCode(this.content)
  }

  onupdate(vnode: m.VnodeDOM<JSONEditorAttributes>) {
    if (this.content !== vnode.attrs.content) {
      this.content = vnode.attrs.content

      const editor = vnode.dom as any
      editor.setCode(this.content)
    }
  }

  view() {
    return m("lit-code", {
      id: this.id,
      language: "json",
      linenumbers: true,
      oncreate: (vnode) => {
        vnode.dom.addEventListener("update", this.changed)
      }
    })
  }
}


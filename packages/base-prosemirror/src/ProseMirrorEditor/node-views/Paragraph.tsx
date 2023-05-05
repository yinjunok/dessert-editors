import { Decoration, DecorationSource, NodeView } from 'prosemirror-view'
import { Node } from 'prosemirror-model'

class ParagraphView implements NodeView {
  // contentDOM: HTMLParagraphElement = document.createElement('p')
  dom: HTMLParagraphElement = document.createElement('p')
  constructor (node: Node) {
    console.log(node)
    // this.dom.textContent = node.text
  }

  update(node: Node) {
    // this.dom.textContent = node.text
    return true
  }
}

export default ParagraphView
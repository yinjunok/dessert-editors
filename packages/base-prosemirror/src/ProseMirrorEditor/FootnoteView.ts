import { StepMap } from 'prosemirror-transform'
import { keymap } from 'prosemirror-keymap'
import { undo, redo } from 'prosemirror-history'
import { EditorView, NodeViewConstructor, NodeView } from 'prosemirror-view'
import { EditorState, Transaction } from 'prosemirror-state'
import { Node } from 'prosemirror-model'

type NodeViewType = Parameters<NodeViewConstructor>

export default class FootnoteView implements NodeView {
  private node: NodeViewType[0]
  private outerView: NodeViewType[1]
  private getPos: NodeViewType[2]
  private innerView?: EditorView
  public dom: HTMLElement = document.createElement('footnote')
  constructor(node: NodeViewType[0], view: NodeViewType[1], getPos: NodeViewType[2]) {
    this.node = node
    this.outerView = view
    this.getPos = getPos
  }

  selectNode() {
    this.dom.classList.add('ProseMirror-selectednode')
    if (!this.innerView) {
      this.open()
    }
  }

  deselectNode() {
    this.dom.classList.remove('ProseMirror-selectednode')
    if (this.innerView) {
      this.close()
    }
  }

  destroy() {
    if (this.innerView) {
      this.close()
    }
  }

  stopEvent(e: Event) {
    return !!(this.innerView && this.innerView.dom.contains(e.target as HTMLElement))
  }

  update(node: Node) {
    if (!node.sameMarkup(this.node)) {
      return false
    }

    this.node = node
    if (this.innerView) {
      const state = this.innerView.state
      const start = node.content.findDiffStart(state.doc.content)
      if (start !== null) {
        const end = node.content.findDiffEnd(state.doc.content)
        if (end) {
          let { a: endA, b: endB } = end
          const overlap = start - Math.min(endA, endA)
          if (overlap > 0) {
            endA += overlap
            endB += overlap
          }
          this.innerView.dispatch(state.tr.replace(start, endB, node.slice(start, endA)).setMeta('fromOutside', true))
        }
      }
    }
    return true
  }

  ignoreMutation() {
    return true
  }

  private open() {
    const tooltip = this.dom.appendChild(document.createElement('div'))
    tooltip.className = 'footnote-tooltip'
    this.innerView = new EditorView(tooltip, {
      state: EditorState.create({
        doc: this.node,
        plugins: [
          keymap({
            'Mod-z': () => undo(this.outerView.state, this.outerView.dispatch),
            'Mod-y': () => redo(this.outerView.state, this.outerView.dispatch)
          })
        ]
      }),
      dispatchTransaction: this.dispatchInner.bind(this),
      handleDOMEvents: {
        mousedown: () => {
          if (this.outerView.hasFocus()) {
            this.innerView?.focus()
          }
        }
      }
    })
  }

  private dispatchInner(tr: Transaction) {
    if (this.innerView) {
      const { state, transactions } = this.innerView.state.applyTransaction(tr)
      this.innerView.updateState(state)

      if (!tr.getMeta('fromOutside')) {
        const outerTr = this.outerView.state.tr
        const offsetMap = StepMap.offset(this.getPos() + 1)
        for (let i = 0; i < transactions.length; i += 1) {
          const steps = transactions[i].steps
          for (let j = 0; j < steps.length; j += 1) {
            const step = steps[j].map(offsetMap)
            if (step) {
              outerTr.step(step)
            }
          }
        }
        if (outerTr.docChanged) {
          this.outerView.dispatch(outerTr)
        }
      }
    }
  }

  private close() {
    this.innerView?.destroy()
    this.innerView = undefined
    this.dom.textContent = ''
  }
}

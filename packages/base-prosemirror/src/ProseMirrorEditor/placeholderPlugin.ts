import { Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

const placeholderPlugin = new Plugin({
  state: {
    init() {
      return DecorationSet.empty
    },
    apply(tr, set) {
      // 调整因为 decoration 的位置，以适应 transaction 引起的文档的改变
      set = set.map(tr.mapping, tr.doc)
      // 查看 transaction 是否增加或者删除任何占位符了
      let action = tr.getMeta(placeholderPlugin)
      if (action && action.add) {
        let widget = document.createElement("placeholder")
        let deco = Decoration.widget(action.add.pos, widget, { id: action.add.id })
        set = set.add(tr.doc, [deco])
      } else if (action && action.remove) {
        console.log(action)
        set = set.remove(set.find(undefined, undefined,
          spec => spec.id == action.remove.id))
      }
      return set
    }
  },
  props: {
    decorations(state) {
      return this.getState(state)
    },
  }
})

export default placeholderPlugin

import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

const key = new PluginKey('placeholder')

const placeholderPlugin = () => {
  return new Plugin({
    key,
    props: {
      decorations(state) {
        const { selection } = state
        if (selection.empty) {
          const { $from } = selection
          if (
            $from.depth === 1 &&
            $from.parent.type.name === 'paragraph' &&
            $from.parent.content.size === 0
          ) {
            const placeholder = document.createElement('placeholder')
            placeholder.textContent = '输入 / 打开更多菜单'
            return DecorationSet.create(state.doc, [Decoration.widget($from.pos, placeholder)])
          }
        }
      },
    }
  })
}

export default placeholderPlugin

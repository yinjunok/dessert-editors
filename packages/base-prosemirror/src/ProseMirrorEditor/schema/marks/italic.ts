import { MarkSpec } from 'prosemirror-model'

const italic: MarkSpec = {
  parseDOM: [
    { tag: 'i' },
    { tag: 'em' },
    { style: 'font-style=italic' },
    { style: 'font-style=normal', clearMark: m => m.type.name === 'em' },
  ],
  toDOM: () => ['em', 0]
}

export default italic

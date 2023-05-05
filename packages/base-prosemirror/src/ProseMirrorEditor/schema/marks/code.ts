import { MarkSpec } from 'prosemirror-model'

const strong: MarkSpec = {
  parseDOM: [{ tag: 'code' }],
  toDOM: () => ['code', { class: 'text-code' }, 0]
}

export default strong

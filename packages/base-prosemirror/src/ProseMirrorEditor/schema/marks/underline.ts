import { MarkSpec } from 'prosemirror-model'

const underline: MarkSpec = {
  parseDOM: [
    { style: 'text-decoration=underline;' }
  ],
  toDOM: () => ['span', { class: 'text-underline' }, 0],
}

export default underline

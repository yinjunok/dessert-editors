import { NodeSpec } from 'prosemirror-model'

const blockquote: NodeSpec = {
  group: 'block',
  content: 'block+',
  defining: true,
  parseDOM: [{ tag: 'blockquote' }],
  toDOM: () => ['blockquote', 0]
}

export default blockquote

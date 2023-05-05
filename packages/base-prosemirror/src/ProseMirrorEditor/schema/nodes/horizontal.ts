import { NodeSpec } from 'prosemirror-model'

const horizontal: NodeSpec = {
  group: 'block',
  parseDOM: [{ tag: 'hr' }],
  toDOM: () => ['hr']
}

export default horizontal

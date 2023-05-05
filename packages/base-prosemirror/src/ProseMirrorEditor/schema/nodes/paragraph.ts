import { NodeSpec } from 'prosemirror-model'

const paragraph: NodeSpec = {
  group: 'block',
  content: 'inline*',
  parseDOM: [{ tag: 'p' }],
  toDOM: () => ['p', 0]
}

export default paragraph

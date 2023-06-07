import { NodeSpec } from 'prosemirror-model'

const listItem: NodeSpec = {
  content: 'block+',
  defining: true,
  // group: 'listItem',
  toDOM: () => ['li', 0],
  parseDOM: [{ tag: 'li' }]
}

export default listItem

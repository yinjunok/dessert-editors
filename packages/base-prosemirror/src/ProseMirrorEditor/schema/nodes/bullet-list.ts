import { NodeSpec } from 'prosemirror-model'

const bulletList: NodeSpec = {
  content: 'listItem+',
  group: 'block',
  parseDOM: [{ tag: 'ul' }],
  toDOM: () => ['ul', 0]
}

export default bulletList

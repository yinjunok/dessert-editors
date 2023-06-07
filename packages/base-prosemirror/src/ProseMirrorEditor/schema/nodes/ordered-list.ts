import { NodeSpec } from 'prosemirror-model'

/**
 * 有序列表
*/
const orderedList: NodeSpec = {
  content: 'listItem+',
  group: 'block',
  parseDOM: [{ tag: 'ol' }],
  toDOM: () => ['ol', 0]
}

export default orderedList

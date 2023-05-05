import { NodeSpec } from 'prosemirror-model'

const codeBlock: NodeSpec = {
  content: 'text*',
  marks: '',
  group: 'block',
  code: true,
  defining: true,
  parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
  toDOM: () => ['pre', ['code', 0]]
}

export default codeBlock

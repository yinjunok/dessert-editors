import { Schema } from 'prosemirror-model'
import nodes from './nodes'
import marks from './marks'

const schema = new Schema({ nodes, marks });

export default schema

export {
  marks,
  nodes,
  schema,
}

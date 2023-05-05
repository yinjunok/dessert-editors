import { EditorState } from 'prosemirror-state'
import { MarkType } from 'prosemirror-model'

export const markActive = (state: EditorState, type: MarkType) => {
  const { from, $from, to, empty } = state.selection
  if (empty) {
    return !!type.isInSet($from.marks())
  }
  return state.doc.rangeHasMark(from, to, type)
}

import { Editor, Element as SlateElement } from 'slate'
import { TextFormatType, ElementType } from './types'

const CustomEditor = {
  toggleMark(editor: Editor, format: TextFormatType) {
    const isActive = CustomEditor.isMarkActive(editor, format)
    if (isActive) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, true)
    }
  },
  isMarkActive(editor: Editor, format: TextFormatType) {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
  },
  isBlockActive(editor: Editor, format: ElementType) {
    const { selection } = editor
    if (!selection) {
      return false
    }

    const nodes = Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format
    })

    const [match] = Array.from(nodes)
    return !!match
  }
}

export default CustomEditor

import { Editor, Element as SlateElement } from 'slate'
import { TextFormatType, ElementType, CustomElement } from './types'

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
  isBlockActive(editor: Editor, format: ElementType, props?: { [P: string]: any }) {
    const { selection } = editor
    if (!selection) {
      return false
    }

    const nodes = Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => {
        const typeMatched = !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format
        
        let propsMatched = true
        if (props) {
          propsMatched = Object.keys(props).every(p => props[p] === (n as CustomElement)[p])
        }
        return typeMatched && propsMatched
      }
    })

    const [match] = Array.from(nodes)
    return !!match
  }
}

export default CustomEditor
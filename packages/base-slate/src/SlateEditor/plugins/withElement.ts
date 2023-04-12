import { Editor } from 'slate'

const withElement = (editor: Editor) => {
  const { isVoid, isInline, markableVoid } = editor
  editor.isVoid = element => element.isVoid ?? isVoid(element)
  editor.isInline = element => element.isInline ?? isInline(element)
  editor.markableVoid = element => element.markableVoid ?? markableVoid(element)
  return editor
}

export default withElement
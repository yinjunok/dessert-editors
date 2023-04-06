import { FC } from 'react'
import { Editor } from 'slate'
import { RenderElementProps } from 'slate-react'

export const widthDivider = (editor: Editor) => {
  const { isVoid } = editor
  editor.isVoid = element => (element.type === 'divider' ? true : isVoid(element))
  return editor
} 

const DividerElement: FC<RenderElementProps> = (props) => (
  <div {...props.attributes} className='my-4 h-0.5 bg-slate-200' contentEditable={false}>
    {props.children}
  </div>
)

export default DividerElement

import { FC } from 'react'
import { useSlate } from 'slate-react'
import { TbBold, TbItalic, TbUnderline, TbStrikethrough } from 'react-icons/tb'
import CustomEditor from "../../CustomEditor"
import Button from '../Button'

const Toolbar: FC = () => {
  const editor = useSlate()

  return (
    <div className='p-2 inline-flex gap-1'>
      <Button
        icon={<TbBold />}
        title='加粗'
        isActive={CustomEditor.isMarkActive(editor, 'bold')}
        onMouseDown={e => {
          e.preventDefault()
          CustomEditor.toggleMark(editor, 'bold')
        }}
      />
      <Button
        icon={<TbItalic />}
        title='斜体'
        isActive={CustomEditor.isMarkActive(editor, 'italic')}
        onMouseDown={e => {
          e.preventDefault()
          CustomEditor.toggleMark(editor, 'italic')
        }}
      />
      <Button
        icon={<TbUnderline />}
        title='下划线'
        isActive={CustomEditor.isMarkActive(editor, 'underline')}
        onMouseDown={e => {
          e.preventDefault()
          CustomEditor.toggleMark(editor, 'underline')
        }}
      />
      <Button
        icon={<TbStrikethrough />}
        title='删除线'
        isActive={CustomEditor.isMarkActive(editor, 'strikethrough')}
        onMouseDown={e => {
          e.preventDefault()
          CustomEditor.toggleMark(editor, 'strikethrough')
        }}
      />
  </div>
  )
}

export default Toolbar

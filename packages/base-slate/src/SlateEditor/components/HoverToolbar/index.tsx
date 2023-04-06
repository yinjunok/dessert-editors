import { FC, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Range, Editor } from 'slate'
import { useFocused, useSlate, useSlateSelection } from 'slate-react'
import { TbBold, TbItalic, TbUnderline, TbStrikethrough, TbCode } from 'react-icons/tb'
import CustomEditor from "../../CustomEditor"
import Button from '../Button'

const HoverToolbar: FC = () => {
  const toolbarRef = useRef<HTMLDivElement>(null)
  const isFocus = useFocused()
  const editor = useSlate()
  const selection = useSlateSelection()

  useEffect(() => {
    if (!toolbarRef.current) {
      return
    }
    const el = toolbarRef.current
    if (
      !selection ||
      !isFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.style.display = 'none'
      return
    }

    el.style.display = 'block'
    const domSelection = window.getSelection()
    if (domSelection && !domSelection.isCollapsed) {
      const domRange = domSelection.getRangeAt(0)
      const rangeRect = domRange.getBoundingClientRect()
      const toolbarRect = el.getBoundingClientRect()
      el.style.top = `${window.scrollY + rangeRect.top - (toolbarRect.height * 1.3)}px`
      el.style.left = `${window.scrollX + rangeRect.left - ((toolbarRect.width - rangeRect.width) / 2)}px`
    }
  }, [selection, isFocus, editor])

  const toolbar = (
    <div
      ref={toolbarRef}
      className='absolute rounded py-1 px-2 shadow-md bg-white'
    >
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
      <Button
        icon={<TbCode />}
        title='代码'
        isActive={CustomEditor.isMarkActive(editor, 'code')}
        onMouseDown={e => {
          e.preventDefault()
          CustomEditor.toggleMark(editor, 'code')
        }}
      />
    </div>
  )

  return createPortal(toolbar, document.body)
}

export default HoverToolbar

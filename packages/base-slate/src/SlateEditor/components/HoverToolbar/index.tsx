import { useState, FC, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Range, Editor, Transforms } from 'slate'
import { useFocused, useSlate, useSlateSelection } from 'slate-react'
import { TbBold, TbItalic, TbUnderline, TbStrikethrough, TbCode, TbLink } from 'react-icons/tb'
import CustomEditor from "../../CustomEditor"
import LinkForm from '../LinkForm'
import Button from '../Button'

const HoverToolbar: FC = () => {
  const toolbarRef = useRef<HTMLDivElement>(null)
  const linkFormRef = useRef<HTMLDivElement>(null)
  const isFocus = useFocused()
  const editor = useSlate()
  const selection = useSlateSelection()
  const [linkFormOpen, setLinkFormOpen] = useState(false)
  const selectionRectRef = useRef<DOMRect>()

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
      selectionRectRef.current = rangeRect
      const toolbarRect = el.getBoundingClientRect()
      el.style.top = `${window.scrollY + rangeRect.top - (toolbarRect.height * 1.3)}px`
      el.style.left = `${window.scrollX + rangeRect.left - ((toolbarRect.width - rangeRect.width) / 2)}px`
    }
  }, [selection, isFocus, editor])

  const toolbar = (
    <>
      <div
        ref={toolbarRef}
        className='absolute rounded py-1 px-2 shadow-md bg-white border-slate-100'
        style={{ borderWidth: 1 }}
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
        <span className='h-4 inline-block mx-2 bg-slate-200' style={{ width: 1 }} />
        <Button
          isActive
          icon={<TbLink />}
          title='超链接'
          onMouseDown={e => {
            e.preventDefault()
            setLinkFormOpen(true)
            if (linkFormRef.current && selectionRectRef.current) {
              const ele = linkFormRef.current
              const rangeRect = selectionRectRef.current
              const linkFormRect = ele.getBoundingClientRect()
              ele.style.top = `${window.scrollY + (rangeRect.height * 1.3) + rangeRect.top}px`
              ele.style.left = `${window.screenY + rangeRect.left - ((linkFormRect.width - rangeRect.width) / 2)}px`
              setLinkFormOpen(true)
            }
          }}
        />
      </div>

      <div
        ref={linkFormRef}
        className='absolute rounded py-1 px-2 shadow-md bg-white border-slate-100'
        style={{ borderWidth: 1, display: linkFormOpen ? 'block' : 'none' }}
      >
        {
          linkFormOpen && (
            <LinkForm
              node={{ text: selection ? Editor.string(editor, selection) : '', url: '' }}
              onSubmit={link => {
                Transforms.wrapNodes(editor, {
                  type: 'link',
                  isInline: true,
                  isVoid: false,
                  markableVoid: false,
                  title: link.text,
                  url: link.url,
                  children: [],
                }, {
                  at: selection!,
                  split: true,
                })
                setLinkFormOpen(false)
              }}
            />
          )
        }
      </div>
    </>
  )

  return createPortal(toolbar, document.body)
}

export default HoverToolbar

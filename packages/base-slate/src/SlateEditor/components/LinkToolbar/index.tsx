import { FC, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Editor, Transforms, Element, Node } from 'slate'
import { useSlate, useSlateSelection, ReactEditor } from 'slate-react'
import { TbLinkOff, TbExternalLink } from 'react-icons/tb'
import type { LinkElement } from '../../types'
import CustomEditor from '../../CustomEditor'
import Button from '../Button'
import LinkForm from '../LinkForm'

const LinkToolbar: FC = () => {
  const toolDOMRef = useRef<HTMLDivElement>(null)
  const linkNode = useRef<LinkElement>()
  const editor = useSlate()
  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const selection = useSlateSelection()

  useEffect(() => {
    if (!toolDOMRef.current) {
      return
    }

    const ele = toolDOMRef.current
    if (
      !selection ||
      !CustomEditor.isBlockActive(editor, 'link')
    ) {
      ele.style.display = 'none'
      linkNode.current = undefined
      setMode('view')
      return
    }

    const node = Editor.above(editor, { mode: 'lowest' })
    if (node) {
      ele.style.display = 'block'
      linkNode.current = node[0] as LinkElement
      const linkDom = ReactEditor.toDOMNode(editor, node[0])
      const linkRect = linkDom.getBoundingClientRect()
      const toolRect = ele.getBoundingClientRect()

      ele.style.top = `${window.scrollY + (linkRect.height * 1.3) + linkRect.top}px`
      ele.style.left = `${window.screenY + linkRect.left - ((toolRect.width - linkRect.width) / 2)}px`
    }
  }, [selection, editor])

  const tool = (
    <div
      ref={toolDOMRef}
      className='absolute rounded py-1 px-2 shadow-md bg-white border-slate-100'
      style={{ borderWidth: 1, display: 'none' }}
    >
      {
        mode === 'view' && (
          <>
            <Button
              isActive
              onMouseDown={e => {
                e.preventDefault()
                setMode('edit')
              }}
            >
              <span className='text-sm'>编辑链接</span>
            </Button>
            <span className='h-4 inline-block mx-2 bg-slate-200' style={{ width: 1 }} />
            <Button
              isActive
              icon={<TbExternalLink />}
              onMouseDown={(e) => {
                if (linkNode.current) {
                  e.preventDefault()
                  window.open(linkNode.current.url)
                }
              }}
            />
            <Button
              isActive
              icon={<TbLinkOff />}
              onMouseDown={e => {
                e.preventDefault()
                Transforms.unwrapNodes(editor, {
                  match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link'
                })
              }}
            />
          </>
        )
      }

      {
        mode === 'edit' && (
          <LinkForm
            node={{ text: Node.string(linkNode.current!), url: linkNode.current!.url }}
            onSubmit={link => {
              const path = ReactEditor.findPath(editor, linkNode.current!)
              Transforms.removeNodes(editor, {
                at: path
              })
              Transforms.insertNodes(editor, {
                type: 'link',
                url: link.url,
                title: link.text,
                isInline: true,
                isVoid: false,
                markableVoid: false,
                children: [{ text: link.text }]
              })
              setMode('view')
            }}
          />
        )
      }
    </div>
  )

  return createPortal(tool, document.body)
}

export default LinkToolbar

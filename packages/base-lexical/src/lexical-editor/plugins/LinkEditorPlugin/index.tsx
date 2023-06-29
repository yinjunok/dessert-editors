import { useRef, useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  $getSelection,
  $isRangeSelection,
  RangeSelection,
  NodeSelection,
  GridSelection
} from 'lexical'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { TbTrash, TbPencil, TbCheck, TbX } from 'react-icons/tb'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { getSelectedNode } from '../../utils/getSelectedNode'
import { sanitizeUrl } from '../../utils/url'
import './styles.scss'

const LinkEditorPlugin = () => {
  const domRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [linkUrl, setLinkUrl] = useState<string>('')
  const [editLinkUrl, setEditLinkUrl] = useState<string>('')
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const lastSelectionRef = useRef<null | RangeSelection | NodeSelection | GridSelection>(null)
  const [editor] = useLexicalComposerContext()

  const showEditor = useCallback((target: DOMRect) => {
    if (domRef.current) {
      domRef.current.classList.add('visible')
      const { scrollX, scrollY } = window
      domRef.current.style.transform = `translate3d(${target.left + scrollX}px, ${target.bottom + scrollY + 4}px, 0)`
    }
  }, [])

  const hiddenEditor = useCallback(() => {
    if (domRef.current) {
      domRef.current.classList.remove('visible')
      lastSelectionRef.current = null
      setLinkUrl('')
    }
  }, [])

  useEffect(() => {
    const cleanHandler = editor.registerUpdateListener(({ editorState }) => {
      if (
        !domRef.current ||
        !editor.isEditable()
      ) {
        hiddenEditor()
        return
      }

      editorState.read(() => {

        const selection = editorState.read(() => $getSelection())
        if ($isRangeSelection(selection)) {
          const node = getSelectedNode(selection)
          const parent = node.getParent()
          if ($isLinkNode(node)) {
            setLinkUrl(node.getURL())
          } else if ($isLinkNode(parent)) {
            setLinkUrl(parent.getURL())
          } else {
            hiddenEditor()
            return false
          }
        }

        const nativeSelection = window.getSelection()
        const rootEle = editor.getRootElement()
        if (
          selection &&
          nativeSelection &&
          rootEle &&
          rootEle.contains(nativeSelection.focusNode)
        ) {
          const targetRect = nativeSelection.focusNode?.parentElement?.getBoundingClientRect()
          if (targetRect) {
            lastSelectionRef.current = selection
            showEditor(targetRect)
            return
          }
        }

        hiddenEditor()
        return
      })
    })

    return cleanHandler
  }, [editor])

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  const content = (
    <div
      ref={domRef}
      className='link-editor'
    >
      {
        isEdit ? (
          <>
            <input
              ref={inputRef}
              className='link-editor-input'
              value={editLinkUrl}
              onChange={e => {
                setEditLinkUrl(e.target.value)
              }}
            />
            <div className='link-editor-actions'>
              <TbX
                className='link-editor-icon'
                onClick={() => setIsEdit(false)}
                onMouseDown={(event: MouseEvent) => event.preventDefault()}
              />
              <TbCheck
                className='link-editor-icon'
                onMouseDown={(event: MouseEvent) => event.preventDefault()}
                onClick={() => {
                  if (lastSelectionRef.current !== null) {
                    if (linkUrl !== '') {
                      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(editLinkUrl));
                    }
                    setIsEdit(false);
                  }
                }}
              />
            </div>
          </>
        ) : (
          <>
            <a href={sanitizeUrl(linkUrl)} target='_blank' className='link-editor-view'>{linkUrl}</a>
            <div className='link-editor-actions'>
              <TbPencil
                className='link-editor-icon'
                onMouseDown={(event: MouseEvent) => event.preventDefault()}
                onClick={() => {
                  setIsEdit(true)
                  setEditLinkUrl(linkUrl)
                }}
              />
              <TbTrash
                className='link-editor-icon'
                onMouseDown={(event: MouseEvent) => event.preventDefault()}
                onClick={() => {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
                }}
              />
            </div>
          </>
        )
      }
    </div>
  )

  return createPortal(content, document.body)
}

export default LinkEditorPlugin

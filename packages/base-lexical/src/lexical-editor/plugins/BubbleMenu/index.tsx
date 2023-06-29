import { useRef, useEffect, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { $isRangeSelection, $getSelection, FORMAT_TEXT_COMMAND } from 'lexical'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { TbBold, TbItalic, TbUnderline, TbStrikethrough, TbCode, TbLink } from 'react-icons/tb'
import Button from './Button'
import { getSelectedNode } from '../../utils/getSelectedNode'
import './styles.scss'

const BubbleMenu = () => {
  const [editor] = useLexicalComposerContext()
  const menuRef = useRef<HTMLDivElement>(null)
  const menuActiveRef = useRef<boolean>(false)
  const [formatActive, setFormatActive] = useState({
    link: false,
    bold: false,
    italic: false,
    code: false,
    underline: false,
    strikethrough: false,
  })

  const setMenuPosition = useCallback(() => {
    const nativeRange = window.getSelection()?.getRangeAt(0)
    const rangeRect = nativeRange?.getBoundingClientRect()
    if (rangeRect) {
      const { scrollX, scrollY } = window
      menuRef.current!.classList.add('visible')
      menuRef.current!.style.transform = `translate3d(${rangeRect.left + scrollX}px, calc(${rangeRect.top + scrollY}px - 100% - 4px), 0)`
    }
  }, [])

  const hiddenMenu = useCallback(() => {
    menuActiveRef.current = false
    menuRef.current!.classList.remove('visible')
  }, [])

  useEffect(() => {
    const removeUpdateListener = editor.registerUpdateListener(({ editorState }) => {
      if (menuRef.current) {
        editorState.read(() => {
          const selection = $getSelection()

          if ($isRangeSelection(selection) && !selection.isCollapsed()) {
            const node = getSelectedNode(selection)
            let link = false
            const parent = node.getParent();
            if ($isLinkNode(parent) || $isLinkNode(node)) {
              link = true
            } else {
              link = false
            }
            menuActiveRef.current = true
            setFormatActive({
              link,
              bold: selection.hasFormat('bold'),
              italic: selection.hasFormat('italic'),
              code: selection.hasFormat('code'),
              underline: selection.hasFormat('underline'),
              strikethrough: selection.hasFormat('strikethrough'),
            })

            setMenuPosition()
          } else {
            hiddenMenu()
          }
        })
      }
    })

    return () => {
      removeUpdateListener()
    }
  }, [editor])

  const content = (
    <div
      ref={menuRef}
      className='bubble-menu'
    >
      <Button
        icon={<TbBold />}
        isActive={formatActive.bold}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
        }}
      />
      <Button
        icon={<TbItalic />}
        isActive={formatActive.italic}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
        }}
      />
      <Button
        icon={<TbUnderline />}
        isActive={formatActive.underline}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
        }}
      />
      <Button
        icon={<TbStrikethrough />}
        isActive={formatActive.strikethrough}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
        }}
      />
      <Button
        icon={<TbCode />}
        isActive={formatActive.code}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
        }}
      />
      <Button
        icon={<TbLink />}
        isActive={formatActive.link}
        onClick={() => {
          if (!formatActive.link) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
          } else {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
          }
        }}
      />
    </div>
  )

  return createPortal(content, document.body)
}

export default BubbleMenu

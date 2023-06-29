import { useRef, useLayoutEffect, useMemo, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  KEY_DOWN_COMMAND,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_ENTER_COMMAND,
  $createRangeSelection,
  $getSelection,
  $isRangeSelection,
  $getNodeByKey,
  $createParagraphNode,
} from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { $createCodeNode } from '@lexical/code'
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list'
import { PointType } from 'lexical/LexicalSelection'
import { $setBlocksType } from '@lexical/selection';
import { matchSorter } from 'match-sorter'
import { TbH1, TbH2, TbH3, TbH4, TbQuote, TbCode, TbListNumbers, TbList, TbPhoto } from 'react-icons/tb'
import { BiParagraph } from 'react-icons/bi'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import MenuItem from './MenuItem'
import { getSelectedNode } from '../../utils/getSelectedNode'
import { $createImageNode } from '../../nodes/ImageNode'
import useInsertImageModal from '../../nodes/ImageNode/useInsertImageModal';
import { MenuItemType } from './types'
import './styles.scss'

const SlashCommandMenu = () => {
  const [menuActiveIndex, setMenuActiveIndex] = useState<number>(0)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuActiveRef = useRef<boolean>(false)
  const anchorRef = useRef<PointType | null>(null)
  const focusRef = useRef<PointType | null>(null)
  const [searchCommandText, setSearchCommandText] = useState<string>('')
  const [editor] = useLexicalComposerContext()
  const [modal, setModalOpen] = useInsertImageModal(payload => {
    setModalOpen(false)
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const imgNode = $createImageNode(payload)
        selection.insertNodes([imgNode])
      }
    })
  })

  const hiddenMenu = useCallback(() => {
    if (menuRef.current) {
      menuRef.current.style.display = 'none'
      menuActiveRef.current = false
      anchorRef.current = null
      focusRef.current = null
      setSearchCommandText('')
    }
  }, [])

  const executeCommand = useCallback((command: MenuItemType['command']) => {
    command()
    if (anchorRef.current && focusRef.current) {
      const sel = $createRangeSelection()
      sel.anchor.set(anchorRef.current.key, anchorRef.current.offset, 'text')
      sel.focus.set(focusRef.current.key, focusRef.current.offset, 'text')
      sel.removeText()
    }
    hiddenMenu()
  }, [])

  const showMenu = useCallback((x: number, y: number) => {
    if (menuRef.current) {
      menuRef.current.style.display = 'block'
      menuRef.current.style.transform = `translate3d(${x}px, ${y + 4}px, 0)`
    }
  }, [])

  const menus: MenuItemType[] = useMemo(() => ([
    {
      icon: <TbH1 />,
      label: '标题1',
      type: 'h1',
      shortcut: 'h1',
      command: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode('h1'))
          }
        })
      }
    },
    {
      icon: <TbH2 />,
      label: '标题2',
      type: 'h2',
      shortcut: 'h2',
      command: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode('h2'))
          }
        })
      }
    },
    {
      icon: <TbH3 />,
      label: '标题3',
      type: 'h3',
      shortcut: 'h3',
      command: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode('h3'))
          }
        })
      }
    },
    {
      icon: <TbH4 />,
      label: '标题4',
      type: 'h4',
      shortcut: 'h4',
      command: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode('h4'))
          }
        })
      }
    },
    {
      icon: <BiParagraph />,
      label: '段落',
      type: 'paragraph',
      shortcut: 'paragraph',
      command: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createParagraphNode())
          }
        })
      }
    },
    {
      icon: <TbListNumbers />,
      label: '有序列表',
      type: 'numberedlist',
      shortcut: 'numberedlist',
      command: () => {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      }
    },
    {
      icon: <TbList />,
      label: '无序列表',
      type: 'bulletedlist',
      shortcut: 'bulletedlist',
      command: () => {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      }
    },
    {
      icon: <TbPhoto />,
      label: '图片',
      type: 'image',
      shortcut: 'image',
      command: () => {
        setModalOpen(true)
      }
    },
    {
      icon: <TbQuote />,
      label: '引用',
      type: 'quote',
      shortcut: 'quote',
      command: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createQuoteNode())
          }
        })
      }
    },
    {
      icon: <TbCode />,
      label: '代码',
      type: 'code',
      shortcut: 'code',
      command: () => {
        editor.update(() => {
          let selection = $getSelection()
          if ($isRangeSelection(selection)) {
            if (selection.isCollapsed()) {
              $setBlocksType(selection, () => $createCodeNode());
            } else {
              const textContent = selection.getTextContent();
              const codeNode = $createCodeNode();
              selection.insertNodes([codeNode]);
              selection = $getSelection();
              if ($isRangeSelection(selection)) {
                selection.insertRawText(textContent);
              }
            }
          }
        })
      }
    },
  ]), [editor])

  const filteredMenus = useMemo(() => matchSorter(menus, searchCommandText, { keys: ['shortcut'] }), [searchCommandText])

  useLayoutEffect(() => {
    const removeKeyDownListener = editor.registerCommand(KEY_DOWN_COMMAND, (event: KeyboardEvent) => {
      if (!menuRef.current) {
        return false
      }

      const { code } = event

      if (code === 'Slash') {
        const nativeSelection = window.getSelection()
        const selection = $getSelection()

        if ($isRangeSelection(selection) && nativeSelection) {
          anchorRef.current = selection.anchor
          menuActiveRef.current = true
          const node = getSelectedNode(selection)
          /**
           * 如果节点内容为空, 选区的 getBoundingClientRect 返回值全为 0.
           * 一般的解决方法, 是先插入一个零宽字符, 测量 rect 后再清除. 参考: 
           * - https://stackoverflow.com/a/62474531
           * - https://stackoverflow.com/a/62474614  
           * 在 slatejs 中, 空元素会默认有个 `&#xFEFF;` 的零宽字符, 所以测量不会有问题.
           * 插入零宽字符这种方案在 lexical 里实现起来并不方便. 
           * 所以当节点内容为空的时候, 使用节点的 rect, 否则时候选区的 rect
          */
          let rect = null
          if (node.getTextContentSize() === 0) {
            const contentEle = editor.getElementByKey(node.getKey())
            rect = contentEle!.getBoundingClientRect()
          } else {
            rect = nativeSelection.getRangeAt(0).getBoundingClientRect()
          }
          const { scrollX, scrollY } = window
          showMenu(scrollX + rect.left, scrollY + rect.bottom)
        }
      }

      if (menuActiveRef.current && code === 'Space') {
        hiddenMenu()
      }

      return false;
    }, COMMAND_PRIORITY_LOW)

    const removeKeyArrowUpListener = editor.registerCommand(KEY_ARROW_UP_COMMAND, (e: KeyboardEvent) => {
      if (menuActiveRef.current) {
        e.preventDefault()
        if (menuActiveIndex === 0) {
          setMenuActiveIndex(filteredMenus.length - 1)
        } else {
          setMenuActiveIndex(index => index - 1)
        }
        return true
      }
      return false
    }, COMMAND_PRIORITY_LOW)

    const removeKeyArrowDownListener = editor.registerCommand(KEY_ARROW_DOWN_COMMAND, (e: KeyboardEvent) => {
      if (menuActiveRef.current) {
        e.preventDefault()
        if (menuActiveIndex >= filteredMenus.length - 1) {
          setMenuActiveIndex(0)
        } else {
          setMenuActiveIndex(index => index + 1)
        }
        return true
      }
      return false
    }, COMMAND_PRIORITY_LOW)

    const removeKeyEnterListener = editor.registerCommand(KEY_ENTER_COMMAND, (e: KeyboardEvent) => {
      if (menuActiveRef.current) {
        e.preventDefault()
        console.log(menuActiveIndex, filteredMenus, filteredMenus[menuActiveIndex].label)
        executeCommand(filteredMenus[menuActiveIndex].command)
        return true
      }
      return false
    }, COMMAND_PRIORITY_LOW)

    const keyUpHandler = (e: KeyboardEvent) => {
      if (menuActiveRef.current) {
        const editorState = editor.getEditorState()
        const command = editorState.read(() => {
          if (anchorRef.current) {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              focusRef.current = selection.focus
              const node = $getNodeByKey(selection.focus.key)
              if (node) {
                return node.getTextContent().slice(anchorRef.current.offset, selection.focus.offset)
              }
            }
          }

          return ''
        })
        if (command === '' || command.length >= 8) {
          hiddenMenu()
          return
        }
        setSearchCommandText(command.slice(1))
        const { code } = e
        if (code !== 'ArrowUp' && code !== 'ArrowDown') {
          setMenuActiveIndex(0)
        }
      }
    }

    const clickHandler = () => {
      hiddenMenu()
    }

    const removeRootListener = editor.registerRootListener((rootElement, prevRootElement) => {
      if (rootElement) {
        rootElement.addEventListener('keyup', keyUpHandler)
        rootElement.addEventListener('click', clickHandler)
      }
      if (prevRootElement) {
        prevRootElement.removeEventListener('keyup', keyUpHandler);
        prevRootElement.removeEventListener('click', clickHandler)
      }
    });

    return () => {
      removeRootListener()
      removeKeyDownListener()
      removeKeyEnterListener()
      removeKeyArrowUpListener()
      removeKeyArrowDownListener()
    }
  }, [editor, menuActiveIndex, filteredMenus])

  const content = (
    <>
      <div
        ref={menuRef}
        className='slash-menu scrollbar'
      >
        {
          filteredMenus.map((menu, i) => (
            <MenuItem
              menu={menu}
              key={menu.label}
              executeCommand={executeCommand}
              isSelected={menuActiveIndex === i}
            />
          ))
        }
      </div>
      {modal}
    </>
  )

  return createPortal(content, document.body)
}

export default SlashCommandMenu

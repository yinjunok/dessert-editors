import { FC, useEffect, useRef, useCallback, useMemo } from 'react'
import { BaseRange, Editor, Range, Transforms } from 'slate'
import { finalize, filter, switchMap, takeWhile, repeat, tap, map, takeUntil, merge, fromEvent } from 'rxjs'
import { useSlate, ReactEditor } from 'slate-react'
import { matchSorter } from 'match-sorter'
import MenuItem, { MenuItemType } from './MenuItem'
import useForceUpdate from '../../hooks/useForceUpdate'
import keyDownSubject from '../../Subject/keyDownSubject'
import keyUpSubject from '../../Subject/keyUpSubject'

/**
 * 菜单激活条件
 * 1. 输入 /
 * 2. 光标处于折叠状态
 * 3. 编辑器处于聚焦状态
*/
const BlockMenu: FC = () => {
  const editor = useSlate()
  const menuRef = useRef<HTMLDivElement>(null)
  const forceUpdate = useForceUpdate()
  const menuIndexRef = useRef<number>(0)
  const filterMenus = useRef<MenuItemType[]>([])

  const command = useCallback((param: Parameters<typeof Transforms.setNodes>[1], start?: Range, end?: Range) => {
    Transforms.setNodes(editor, param, { at: start ?? undefined })
    if (start && end) {
      Transforms.delete(editor, {
        at: {
          anchor: start.anchor,
          focus: end.focus,
        }
      })
      Transforms.setSelection(editor, start)
    }
  }, [])

  const menus: MenuItemType[] = useMemo(() => (
    [
      {
        label: '标题1',
        type: 'heading',
        shortcut: 'heading1',
        props: {
          level: 1
        },
        command(start, end) {
          command({ type: 'heading', level: 1, }, start, end)
        },
      },
      {
        label: '标题2',
        type: 'heading',
        shortcut: 'heading2',
        props: {
          level: 2
        },
        command(start, end) {
          command({ type: 'heading', level: 2, }, start, end)
        },
      },
      {
        label: '标题3',
        type: 'heading',
        shortcut: 'heading3',
        props: {
          level: 3
        },
        command(start, end) {
          command({ type: 'heading', level: 3, }, start, end)
        },
      },
      {
        label: '标题4',
        type: 'heading',
        shortcut: 'heading4',
        props: {
          level: 4
        },
        command(start, end) {
          command({ type: 'heading', level: 4, }, start, end)
        },
      },
      {
        label: '段落',
        type: 'paragraph',
        shortcut: 'paragraph',
        command(start, end) {
          command({ type: 'paragraph' }, start, end)
        },
      },
      {
        label: '引用',
        type: 'quotes',
        shortcut: 'quotes',
        command(start, end) {
          command({ type: 'quotes' }, start, end)
        },
      },
      {
        label: '代码',
        type: 'code',
        shortcut: 'code',
        command(start, end) {
          command({ type: 'code' }, start, end)
        },
      },
      {
        label: '分割线',
        type: 'divider',
        shortcut: 'divider',
        command(start, end) {
          command({ type: 'divider' }, start, end)
        },
      }
    ]
  ), [])

  useEffect(() => {
    if (!menuRef.current) {
      return
    }
    const el = menuRef.current
    let menuActive = false
    let commandStartSelection: Range | undefined

    const commandEnter$ = keyUpSubject.pipe(
      filter(e => e.key === 'Enter')
    )

    const dir = ['ArrowUp', 'ArrowDown']
    const menuSelectSub = keyDownSubject.pipe(
      filter(e => dir.includes(e.key) && menuActive),
      tap(e => e.preventDefault()),
    ).subscribe(e => {
      if (e.key === 'ArrowUp') {
        if (menuIndexRef.current === 0) {
          menuIndexRef.current = filterMenus.current.length - 1
        } else {
          menuIndexRef.current! -= 1
        }
      }

      if (e.key === 'ArrowDown') {
        if (menuIndexRef.current === filterMenus.current.length - 1) {
          menuIndexRef.current = 0
        } else {
          menuIndexRef.current! += 1
        }
      }

      forceUpdate()
    })
    const enterSub = keyDownSubject.pipe(
      filter((e) => menuActive && e.key === 'Enter'),
    ).subscribe((e) => {
      e.preventDefault()
      const m = filterMenus.current[menuIndexRef.current]
      m.command(commandStartSelection, editor.selection ?? undefined)
      menuActive = false
      menuIndexRef.current = 0
    })

    const commandSub = keyDownSubject.pipe(
      filter(e => e.key === '/'),
      tap(() => {
        if (
          editor.selection &&
          ReactEditor.isFocused(editor) &&
          Range.isCollapsed(editor.selection)
        ) {
          menuActive = true
          commandStartSelection = editor.selection
          el.style.display = 'block'
          const domSelection = window.getSelection()
          // 编辑器在聚焦失焦状态切换的时候, slate 自身的选区跟 dom 的选区可能不同步, 造成编辑器崩溃
          if (domSelection && domSelection.isCollapsed && domSelection.rangeCount !== 0) {
            const domRange = domSelection.getRangeAt(0)
            const rangeRect = domRange.getBoundingClientRect()
            el.style.top = `${window.scrollY + rangeRect.height + rangeRect.top}px`
            el.style.left = `${window.scrollX + rangeRect.left}px`
          }
        }
      }),
      switchMap(() => {
        return keyUpSubject.pipe(
          filter(e => !dir.includes(e.key)),
          map(() => {
            if (commandStartSelection && editor.selection) {
              const range: BaseRange = {
                anchor: commandStartSelection.anchor,
                focus: editor.selection.focus,
              }
              return Editor.string(editor, range)
            }

            return ''
          })
        )
      }),
      takeWhile(command => command.length <= 7 && command.length > 0),
      takeUntil(merge(commandEnter$, fromEvent(document, 'click'))),
      finalize(() => {
        el.style.display = 'none'
        menuActive = false
        commandStartSelection = undefined
        filterMenus.current = menus
        forceUpdate()
      }),
      map(command => command.slice(1)),
      repeat()
    ).subscribe((command) => {
      if (command) {
        menuIndexRef.current = 0
        filterMenus.current = matchSorter(menus, command, { keys: ['shortcut'] })
        forceUpdate()
      }
    })

    return () => {
      commandSub.unsubscribe()
      menuSelectSub.unsubscribe()
      enterSub.unsubscribe()
    }
  }, [])

  return (
    <div
      ref={menuRef}
      style={{ display: 'none' }}
      className='absolute z-10 rounded shadow-md bg-white max-h-80 overflow-auto'
    >
      {
        filterMenus.current.map((m, i) => (
          <MenuItem
            menu={m}
            key={m.label}
            isSelected={menuIndexRef.current === i}
          />
        ))
      }
    </div>
  )
}

export default BlockMenu

import React, { FC, useMemo, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { Range } from 'slate'
import { useSlate, useSlateSelection } from 'slate-react'
import CustomEditor from '../../CustomEditor'
import { ElementType } from '../../types'

export type MenuItemType = {
  label: string
  type: ElementType
  shortcut: string
  command: (start?: Range, end?: Range) => void
  icon?: React.ReactNode
}

const MenuItem: FC<{ menu: MenuItemType, isSelected: boolean }> = ({ menu, isSelected }) => {
  const editor = useSlate()
  const itemRef = useRef<HTMLDivElement>(null)
  const selection = useSlateSelection()
  const isActive = useMemo(() => CustomEditor.isBlockActive(editor, menu.type), [editor, selection, menu])

  useEffect(() => {
    if (isSelected && itemRef.current) {
      itemRef.current.scrollIntoView({
        behavior: 'auto',
        block: 'nearest'
      })
    }
  }, [isSelected])

  return (
    <div
      ref={itemRef}
      onClick={() => menu.command(editor.selection ?? undefined, editor.selection ?? undefined)}
      className={
        clsx(
          'flex gap-x-2 items-center py-2 px-4 hover:bg-slate-100 cursor-pointer text-sm w-40',
          {
            ['border-l-2']: isActive,
            ['border-blue-500']: isActive,
            ['bg-slate-100']: isSelected
          }
        )
      }
    >
      {menu.icon}
      {menu.label}
    </div>
  )
}

export default MenuItem
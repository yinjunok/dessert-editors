import { FC, useMemo } from 'react'
import clsx from 'clsx'
import { useSlate, useSlateSelection } from 'slate-react'
import CustomEditor from '../../CustomEditor'
import { ElementType } from '../../types'
import { Range } from 'slate'

export type MenuItemType = {
  label: string
  type: ElementType
  shortcut: string
  command: (start?: Range, end?: Range) => void
  props?: { [P: string]: any }
}

const MenuItem: FC<{ menu: MenuItemType, isSelected: boolean }> = ({ menu, isSelected }) => {
  const editor = useSlate()
  const selection = useSlateSelection()
  const isActive = useMemo(() => CustomEditor.isBlockActive(editor, menu.type, menu.props), [editor, selection, menu])

  return (
    <div
      onClick={() => menu.command(editor.selection ?? undefined, editor.selection ?? undefined)}
      className={
        clsx(
          'py-2 px-4 hover:bg-slate-100 cursor-pointer text-sm w-40',
          {
            ['border-l-2']: isActive,
            ['border-blue-500']: isActive,
            ['bg-slate-100']: isSelected
          }
        )
      }
    >
      {menu.label}
    </div>
  )
}

export default MenuItem
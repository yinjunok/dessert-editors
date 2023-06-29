import { FC, useRef, useLayoutEffect } from 'react'
import { MenuItemType } from './types'
import clsx from 'clsx'

const MenuItem: FC<{
  menu: MenuItemType,
  executeCommand?: (commnad: MenuItemType['command']) => void,
  isSelected?: boolean,
}> = ({ menu, isSelected = false, executeCommand = () => {} }) => {
  const itemRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (isSelected && itemRef.current) {
      itemRef.current.scrollIntoView({
        block: 'nearest'
      })
    }
  }, [isSelected])

  return (
    <div
      ref={itemRef}
      onClick={() => {
        executeCommand(menu.command)
      }}
      className={clsx('slash-menu-item', { selected: isSelected })}
    >
      {menu.icon}
      {menu.label}
    </div>
  )
}

export default MenuItem

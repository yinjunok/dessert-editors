import { FC, useMemo } from 'react'
import { Node } from 'slate'
import { RenderElementProps, useSelected } from 'slate-react'
import clsx from 'clsx'
import './style.scss'

const Default: FC<RenderElementProps> = ({ element, children, attributes }) => {
  const selected = useSelected()
  const text = useMemo(() => Node.string(element), [element])

  return (
    <p
      {...attributes}
      placeholder='输入 / 打开更多菜单'
      className={clsx('text-base', { placeholder: text === '' && selected })}
    >
      {children}
    </p>
  )
}

export default Default

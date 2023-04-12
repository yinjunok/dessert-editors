import { FC } from 'react'
import { Transforms } from 'slate'
import { RenderElementProps, useSelected, ReactEditor, useSlateStatic } from 'slate-react'
import { TbTrash } from 'react-icons/tb'
import clsx from 'clsx'
import type { ImageElement } from '../../types'

const Image: FC<RenderElementProps> = ({ children, attributes, element }) => {
  const ele = element as ImageElement
  const selected = useSelected()
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, element)

  return (
    <div {...attributes} className='mb-4' contentEditable={false}>
      <div
        className='relative text-center'
      >
        <button
          onClick={() => Transforms.removeNodes(editor, { at: path })}
          className={clsx('absolute py-1 px-1 rounded bg-slate-50 hover:bg-slate-100 left-1 top-1', { ['block']: selected, ['hidden']: !selected })}
        >
          <TbTrash />
        </button>
        <img
          src={ele.url}
          className='block max-w-full h-auto'
        />
      </div>
      {children}
    </div>
  )
}

export default Image

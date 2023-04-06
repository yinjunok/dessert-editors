import { FC } from 'react'
import { RenderElementProps } from 'slate-react'
import { HeadingElement as HeadingElementType } from '../../types'

const HeadingElement: FC<RenderElementProps & { element: HeadingElementType }> = ({ element, children, attributes }) => {
  if (element.level === 2) {
    return <h2 {...attributes} className='text-2xl'>{children}</h2>
  }

  if (element.level === 3) {
    return <h3 {...attributes} className='text-xl'>{children}</h3>
  }

  if (element.level === 4) {
    return <h4 {...attributes} className='text-lg'>{children}</h4>
  }

  return <h1 {...attributes} className='text-3xl'>{children}</h1>
}

export default HeadingElement

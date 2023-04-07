import { FC } from 'react'
import { RenderElementProps } from 'slate-react'
import { HeadingElement as HeadingElementType } from '../../types'

const Heading: FC<RenderElementProps & { element: HeadingElementType }> = ({ element, children, attributes }) => {
  switch (element.type) {
    case 'h1':
      return <h1 {...attributes} className='text-3xl'>{children}</h1>
    case 'h2':
      return <h2 {...attributes} className='text-2xl'>{children}</h2>
    case 'h3':
      return <h3 {...attributes} className='text-xl'>{children}</h3>
    case 'h4':
      return <h4 {...attributes} className='text-lg'>{children}</h4>
  }
}

export default Heading

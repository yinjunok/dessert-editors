import { FC } from 'react'
import { RenderElementProps } from 'slate-react'

const Quotes: FC<RenderElementProps> = (props) => (
  <blockquote {...props.attributes} className='px-2 py-1 border-l-2 border-slate-400'>
    {props.children}
  </blockquote>
)

export default Quotes

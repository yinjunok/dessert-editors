import { FC } from 'react'
import { RenderElementProps } from 'slate-react'

const Quotes: FC<RenderElementProps> = (props) => (
  <blockquote {...props.attributes} className='px-2 py-2 border-l-4 border-slate-400 bg-slate-50 rounded'>
    {props.children}
  </blockquote>
)

export default Quotes

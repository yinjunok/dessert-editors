import { FC } from 'react'
import { RenderElementProps } from 'slate-react'

const Divider: FC<RenderElementProps> = (props) => (
  <div {...props.attributes} className='my-4 h-0.5 bg-slate-200' contentEditable={false}>
    {props.children}
  </div>
)

export default Divider

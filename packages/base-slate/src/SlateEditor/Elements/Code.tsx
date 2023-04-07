import { FC } from 'react'
import { RenderElementProps } from 'slate-react'

const Code: FC<RenderElementProps> = (props) => (
  <pre {...props.attributes} className='bg-slate-100 rounded p-3'>
    <code>{props.children}</code>
  </pre>
)

export default Code

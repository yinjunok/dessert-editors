import { FC } from 'react'
import { RenderElementProps } from 'slate-react'

const NumberedList: FC<RenderElementProps> = (props) => (
  <ol {...props.attributes} className='list-decimal list-inside'>
    {props.children}
  </ol>
)

export default NumberedList

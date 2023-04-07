import { FC } from 'react'
import { RenderElementProps } from 'slate-react'

const BulletedList: FC<RenderElementProps> = (props) => (
  <ul {...props.attributes} className='list-disc list-inside'>
    {props.children}
  </ul>
)

export default BulletedList

import { FC } from 'react'
import { RenderElementProps } from 'slate-react'

const ListItem: FC<RenderElementProps> = (props) => (
  <li {...props.attributes}>
    {props.children}
  </li>
)

export default ListItem

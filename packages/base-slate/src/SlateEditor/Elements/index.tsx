import { RenderElementProps } from 'slate-react'
import Default from './Default'
import Code from './Code'
import Heading from './Heading'
import Quotes from './Quotes'
import Divider from './Divider'
import ListItem from './ListItem'
import NumberedList from './NumberedList'
import BulletedList from './BulletedList'
import UploadHolder from './UploadHolder'
import Link from './Link'
import Image from './Image'

const renderElement = (props: RenderElementProps) => {
  switch (props.element.type) {
    case 'code':
      return <Code {...props} />
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
      return <Heading element={props.element} attributes={props.attributes} children={props.children} />
    case 'quotes':
      return <Quotes {...props} />
    case 'divider':
      return <Divider {...props} />
    case 'numbered-list':
      return <NumberedList {...props} />
    case 'bulleted-list':
      return <BulletedList {...props} />
    case 'list-item':
      return <ListItem {...props} />
    case 'image':
      return <Image {...props} />
    case 'upload-holder':
      return <UploadHolder {...props} />
    case 'link':
      return <Link {...props} />
    default:
      return <Default {...props} />
  }
}

export default renderElement

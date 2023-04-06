import { RenderElementProps } from 'slate-react'
import DefaultElement from './DefaultElement'
import CodeElement from './CodeElement'
import HeadingElement from './HeadingElement'
import QuotesElement from './QuotesElement'
import DividerElement from './DividerElement'

const renderElement = (props: RenderElementProps) => {
  switch (props.element.type) {
    case 'code':
      return <CodeElement {...props} />
    case 'heading':
      return <HeadingElement element={props.element} attributes={props.attributes} children={props.children} />
    case 'quotes':
      return <QuotesElement {...props} />
    case 'divider':
      return <DividerElement {...props} />
    default:
      return <DefaultElement {...props} />
  }
}

export default renderElement

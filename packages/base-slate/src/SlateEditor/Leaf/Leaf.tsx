import { RenderLeafProps } from 'slate-react'

const renderLeaf = (props: RenderLeafProps) => {
  const { leaf, attributes } = props
  let { children } = props

  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  if (leaf.strikethrough) {
    children = <del>{children}</del>
  }

  if (leaf.code) {
    children = <code className='rounded bg-slate-100 px-1 mx-1'>{children}</code>
  }

  return (
    <span
      {...attributes}
    >
      {children}
    </span>
  )
}

export default renderLeaf

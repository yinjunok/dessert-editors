import { FC } from 'react'
import { RenderElementProps } from 'slate-react'
import type { LinkElement } from '../../types'

// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
const InlineChromiumBugfix = () => (
  <span
    contentEditable={false}
    style={{ fontSize: 0 }}
  >
    ${String.fromCodePoint(160) /* Non-breaking space */}
  </span>
)

const Link: FC<RenderElementProps> = ({ attributes, element, children }) => {
  const ele = element as LinkElement

  return (
    <a
      {...attributes}
      title={ele.title}
      href={ele.url}
      target='_blank'
      rel='noopener noreferrer'
      className='underline'
    >
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </a>
  )
}

export default Link

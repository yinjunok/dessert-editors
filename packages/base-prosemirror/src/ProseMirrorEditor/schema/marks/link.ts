import { MarkSpec } from 'prosemirror-model'

const link: MarkSpec = {
  attrs: {
    href: {},
    title: {}
  },
  inclusive: false,
  parseDOM: [
    {
      tag: 'a[href]',
      getAttrs(dom) {
        if (typeof dom === 'string') {
          return {
            href: undefined,
            title: undefined
          }
        }
        return {
          href: dom.getAttribute('href'),
          title: dom.getAttribute('title')
        }
      }
    }
  ],
  toDOM: n => {
    const { title, href } = n.attrs
    return ['a', { title, href }, 0]
  }
}

export default link

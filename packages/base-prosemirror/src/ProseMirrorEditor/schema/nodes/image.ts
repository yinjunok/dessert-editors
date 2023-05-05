import { NodeSpec } from 'prosemirror-model'

const image: NodeSpec = {
  inline: true,
  attrs: {
    src: {},
    alt: {},
    title: {}
  },
  group: 'inline',
  draggable: true,
  parseDOM: [
    {
      tag: 'img[src]',
      getAttrs(dom) {
        if (typeof dom === 'string') {
          return {
            src: undefined,
            title: undefined,
            alt: undefined
          }
        }
        return {
          src: dom.getAttribute('src'),
          title: dom.getAttribute('title'),
          alt: dom.getAttribute('alt')
        }
      }
    }
  ],
  toDOM: (node) => {
    const { src, alt, title } = node.attrs
    return ["img", { src, alt, title }]
  }
}

export default image

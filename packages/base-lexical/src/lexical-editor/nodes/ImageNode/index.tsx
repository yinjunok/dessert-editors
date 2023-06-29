import {
  NodeKey,
  DecoratorNode,
  EditorConfig,
  DOMConversionMap,
  DOMExportOutput,
  LexicalNode,
  $applyNodeReplacement,
  DOMConversionOutput,
} from 'lexical'
import ImageComponent from './ImageComponent'

export type ImagePayload = {
  src: string
  alt: string
  key?: NodeKey;
}

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { alt: alt, src } = domNode;
    const node = $createImageNode({ src, alt });
    return { node };
  }
  return null;
}

export class ImageNode extends DecoratorNode<JSX.Element> {
  static getType(): string {
    return 'image'
  }

  constructor(
    private __src: string,
    private __alt: string = '',
    key?: NodeKey
  ) {
    super(key)
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__key,
    );
  }

  createDOM(config: EditorConfig): HTMLElement {
    const wrapper = document.createElement('span')
    const theme = config.theme
    if (theme.image) {
      wrapper.classList.add(theme.image)
    }

    return wrapper
  }

  updateDOM(): false {
    return false
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img')
    element.setAttribute('src', this.__src)
    element.setAttribute('alt', this.__alt)

    return {
      element,
    }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }
  getSrc(): string {
    return this.__src
  }

  getAl(): string {
    return this.__alt
  }

  decorate(): JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        alt={this.__alt}
      />
    )
  }
}

export function $createImageNode({
  src,
  alt,
  key,
}: ImagePayload): ImageNode {
  return $applyNodeReplacement(
    new ImageNode(
      src,
      alt,
      key,
    ),
  );
}

export const $isImageNode = (node: LexicalNode | null | undefined): node is ImageNode => {
  return node instanceof ImageNode
}

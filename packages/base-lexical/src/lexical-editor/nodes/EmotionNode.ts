import { TextNode, NodeKey, EditorConfig } from 'lexical'

export class EmotionNode extends TextNode {
  static getType(): string {
    return 'emotion'
  }

  static clone(node: EmotionNode): TextNode {
    return new EmotionNode(node.getClassName(), node.getTextContent(), node.getKey())
  }

  constructor(private __className: string, text: string, key?: NodeKey) {
    super(text, key)
  }

  getClassName() {
    return this.__className
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config)
    dom.className = this.__className
    return dom
  }
}

export const $isEmotionNode = (node: TextNode) => {
  return node instanceof EmotionNode
}

export const $createEmotionNode = (className: string, emotionText: string) => {
  return new EmotionNode(className, emotionText).setMode('token')
}

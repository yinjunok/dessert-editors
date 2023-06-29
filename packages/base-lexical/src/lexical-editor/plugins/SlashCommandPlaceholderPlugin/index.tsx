import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { LexicalNode, $getSelection, $getRoot, $isRangeSelection, $getNodeByKey, NodeKey } from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import './styles.css'

/**
 * 获取节点 root 下直接父级元素
*/
const findTopParent = (node: LexicalNode | null, topKeys: NodeKey[]) => {
  let _node: LexicalNode | null = node
  while (_node !== null) {
    if (topKeys.includes(_node.getKey())) {
      return _node
    }
    _node = _node.getParent()
  }
}

const PlaceholderPlugin = () => {
  const domRef = useRef<HTMLDivElement>(null)
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    const removeUpdateListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot()
        const selection = $getSelection()
        if ($isRangeSelection(selection) && domRef.current) {
          const topKeys = root.getChildrenKeys()
          const anchor = selection.anchor
          const topParent = findTopParent($getNodeByKey(anchor.key), topKeys)
          if (topParent) {
            const topEle = editor.getElementByKey(topParent.getKey())
            if (topParent.getTextContentSize() === 0 && topEle && domRef.current) {
              const topEleRect = topEle.getBoundingClientRect()
              const { scrollX, scrollY } = window
              domRef.current.style.transform = `translate3d(calc(${scrollX + topEleRect.left}px + .5em), ${scrollY + topEleRect.top}px, 0)`
              domRef.current.style.opacity = '.65'
              return
            }
          }
          domRef.current.style.opacity = '0'
          domRef.current.style.transform = `translate3d(-100000px, -100000px, 0)`
        }
      })
    })

    return () => removeUpdateListener()
  }, [editor])

  const content = (
    <div
      ref={domRef}
      className='slash-placeholder'
    >
      输入 / 打开更多菜单
    </div>
  )

  return createPortal(content, document.body)
}

export default PlaceholderPlugin

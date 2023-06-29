import { useEffect } from 'react'
import { TextNode, LexicalEditor } from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createEmotionNode } from '../nodes/EmotionNode';

function useEmotion(editor: LexicalEditor) {
  useEffect(() => {
    const removeTransform = editor.registerNodeTransform(TextNode, emotionTransform);
    return () => {
      removeTransform();
    };
  }, [editor]);
}

const emotionTransform = (node: TextNode) => {
  const text = node.getTextContent()
  if (text === ':)') {
    node.replace($createEmotionNode('', '🙂'))
  }
}

const EmotionPlugin = () => {
  const [editor] = useLexicalComposerContext()
  useEmotion(editor)
  
  return null
}

export default EmotionPlugin

import { InitialConfigType } from '@lexical/react/LexicalComposer'
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode } from '@lexical/link'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { CodeNode } from '@lexical/code'
import { EmotionNode } from './nodes/EmotionNode'
import { ImageNode } from './nodes/ImageNode';
import theme from "./themes";

const editorConfig: InitialConfigType = {
  namespace: 'lexical-editor',
  theme: theme,
  onError(error) {
    throw error;
  },
  
  nodes: [
    EmotionNode,
    ListItemNode,
    ListNode,
    LinkNode,
    HeadingNode,
    QuoteNode,
    CodeNode,
    ImageNode
  ]
};

export default editorConfig;

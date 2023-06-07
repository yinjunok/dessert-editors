import { InitialConfigType } from '@lexical/react/LexicalComposer'
import { EmojiNode } from "./nodes/EmojiNode";
import theme from "./themes";

const editorConfig: InitialConfigType = {
  namespace: 'lexical-editor',
  theme: theme,
  onError(error) {
    throw error;
  },
  nodes: [EmojiNode]
};

export default editorConfig;

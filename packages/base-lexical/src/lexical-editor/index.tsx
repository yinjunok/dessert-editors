import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import TreeViewPlugin from "./plugins/TreeViewPlugin";;
import MyCustomAutoFocusPlugin from "./plugins/MyCustomAutoFocusPlugin";
import SlashCommandPlaceholderPlugin from './plugins/SlashCommandPlaceholderPlugin'
import EmotionPlugin from "./plugins/EmotionPlugin";
import SlashCommandMenu from './plugins/SlashCommandMenu'
import BubbleMenu from './plugins/BubbleMenu'
import LinkPlugin from "./plugins/LinkPlugin";
import LinkEditorPlugin from './plugins/LinkEditorPlugin'
import editorConfig from "./config";
import Test from "./plugins/Test";
import './styles.scss'

export default function Editor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={() => { }} />
        <HistoryPlugin />
        <TreeViewPlugin />
        <EmotionPlugin />
        <ListPlugin />
        <MyCustomAutoFocusPlugin />
        <SlashCommandMenu />
        <SlashCommandPlaceholderPlugin />
        <Test />
        <BubbleMenu />
        <LinkPlugin />
        <LinkEditorPlugin />
      </div>
    </LexicalComposer>
  );
}

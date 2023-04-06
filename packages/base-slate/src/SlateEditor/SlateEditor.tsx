import { useState, FC, useMemo } from 'react'
import { createEditor, Descendant } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import isHotkey from 'is-hotkey'
import renderElement from './Elements'
import renderLeaf from './Leaf/Leaf'
import { CustomElement, TextFormatType } from './types'
import { deserialize, serialize } from './utils'
import CustomEditor from './CustomEditor'
import BlockMenu from './components/BlockMenu'
import HoverToolbar from './components/HoverToolbar'
import keyDownSubject from './Subject/keyDownSubject'
import keyUpSubject from './Subject/keyUpSubject'
import { widthDivider } from './Elements/DividerElement'
import Ctx from './context'
import './tailwind.css'
import './base.scss'

export type SlateEditorProps = {

}

const HOTKEYS: {[P: string]: TextFormatType} = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const SlateEditor: FC<SlateEditorProps> = () => {
  const [editor] = useState(() => widthDivider(withHistory(withReact(createEditor()))))
  const initialValue: Descendant[] = useMemo(() => {
    const initVal: CustomElement[] = [
      {
        type: 'paragraph',
        children: [{ text: 'A line of text in a paragraph.' }],
      },
    ]
    const content = localStorage.getItem('content')
    return content ? deserialize(content) as Descendant[] : initVal
  }, [])

  return (
    <Ctx.Provider value={{}}>
      <Slate
        editor={editor}
        value={initialValue}
        onChange={v => {
          const isAstChange = editor.operations.some(op => 'set_selection' !== op.type)
          if (isAstChange) {
            localStorage.setItem('content', serialize(v))
          }
        }}
      >
        <HoverToolbar />
        <BlockMenu />
        <Editable
          className='slate-editor'
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          onKeyDown={e => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, e)) {
                e.preventDefault()
                const mark = HOTKEYS[hotkey]
                CustomEditor.toggleMark(editor, mark)
              }
            }
            keyDownSubject.next(e.nativeEvent)
          }}
          onKeyUp={e => {
            keyUpSubject.next(e.nativeEvent)
          }}
        />
      </Slate>
    </Ctx.Provider>
  )
}

export default SlateEditor

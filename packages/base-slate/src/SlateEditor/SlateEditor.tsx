import { useState, FC } from 'react'
import { createEditor, Descendant, Transforms, Editor, Element, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import isHotkey from 'is-hotkey'
import renderElement from './Elements'
import renderLeaf from './Leaf/Leaf'
import { TextFormatType } from './types'
import CustomEditor from './CustomEditor'
import BlockMenu from './components/BlockMenu'
import HoverToolbar from './components/HoverToolbar'
import keyDownSubject from './Subject/keyDownSubject'
import keyUpSubject from './Subject/keyUpSubject'
import { widthDivider } from './Elements/Divider'
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

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '一行文本' }],
  },
]

/**
 * 如果在空行换行, 切换成段落
*/

const SlateEditor: FC<SlateEditorProps> = () => {
  const [editor] = useState(() => widthDivider(withHistory(withReact(createEditor()))))

  return (
    <Ctx.Provider value={{}}>
      <Slate
        editor={editor}
        value={initialValue}
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
            if (e.key === 'Enter' && editor.selection) {
              const nodeEntry = Editor.above(editor, { mode: 'lowest' })
              if (nodeEntry) {
                const node = nodeEntry[0]
                if (Element.isElement(node) && node.type !== 'paragraph' && Node.string(node) === '') {
                  e.preventDefault()
                  if (node.type === 'list-item') {
                    Transforms.liftNodes(editor)
                  }
                  Transforms.setNodes(editor, { type: 'paragraph' })
                }
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

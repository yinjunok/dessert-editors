import { useState, FC, useCallback } from 'react'
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
import LinkToolbar from './components/LinkToolbar'
import keyDownSubject from './Subject/keyDownSubject'
import keyUpSubject from './Subject/keyUpSubject'
import Ctx, { UploadItemType } from './context'
import withElement from './plugins/withElement'
import './tailwind.css'
import './base.scss'

export type SlateEditorProps = {

}

const HOTKEYS: { [P: string]: TextFormatType } = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    isInline: false,
    isVoid: false,
    markableVoid: false,
    children: [
      { text: '挞斗像一艘艘航船，在金色的稻浪上行驶；' },
      {
        type: 'link',
        title: '超链接',
        isInline: true,
        isVoid: false,
        markableVoid: false,
        url: 'https://www.baidu.com',
        children: [{ text: '开镰收割金秋的歌声如此深情愉悦，' }]
      },
      { text: '粗犷的音韵在稻浪上流泻；' }
    ]
  },
]

const SlateEditor: FC<SlateEditorProps> = () => {
  const [editor] = useState(() => withElement(withHistory(withReact(createEditor()))))
  const [uploads, setUploads] = useState<UploadItemType[]>([])

  const removeUploadItem = useCallback((id: string) => {
    setUploads(state => state.filter(s => s.id !== id))
  }, [])

  const updateUploadItem = useCallback((newItem: UploadItemType) => {
    setUploads(state => state.map(item => item.id === newItem.id ? newItem : item))
  }, [])

  const addUploadItem = useCallback((item: UploadItemType) => {
    setUploads(state => [...state, item])
  }, [])

  const getUploadItem = useCallback((id: string) => uploads.find(item => item.id === id), [uploads])

  return (
    <Ctx.Provider value={{
      uploads,
      getUploadItem,
      addUploadItem,
      removeUploadItem,
      updateUploadItem,
    }}>
      <Slate
        editor={editor}
        value={initialValue}
      >
        <HoverToolbar />
        <BlockMenu />
        <LinkToolbar />
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

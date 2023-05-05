import { useEffect, useRef, useState } from 'react'
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { DOMParser } from 'prosemirror-model'
import 'prosemirror-example-setup/style/style.css'
import 'prosemirror-view/style/prosemirror.css'
import { undo, redo, history } from 'prosemirror-history'
import { baseKeymap } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
// import ParagraphView from './node-views/Paragraph'
import placeholderPlugin from './plugins/placeholder'
import bubbleMenu from './plugins/bubble-menu'
import schema from './schema'
import EditorStyles from './EditorStyles'

const ProseMirrorEditor = () => {
  const viewDomRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView>()
  const [editorState, setEditorState] = useState<EditorState>()

  useEffect(() => {
    if (viewDomRef.current) {
      let state = EditorState.create({
        doc: DOMParser.fromSchema(schema).parse(document.querySelector("#content")!),
        schema,
        plugins: [
          history(),
          bubbleMenu,
          keymap(baseKeymap),
          placeholderPlugin(),
          keymap({ "Mod-z": undo, "Mod-y": redo }),
        ]
      })
      setEditorState(state)

      viewRef.current = new EditorView(viewDomRef.current, {
        state,
        dispatchTransaction(tr) {
          const newState = viewRef.current!.state.apply(tr)
          viewRef.current?.updateState(newState)
          setEditorState(newState)
        },
      })

      return () => {
        viewRef.current?.destroy()
      }
    }
  }, [])

  return (
    <>
      <EditorStyles />
      <div ref={viewDomRef} className='prosemirror-editor' />
      <div id='content' style={{ display: 'none' }}>
        <p>1. 0123456789</p>
        <p>2. 0123456789</p>
        <p>3. 0123456789</p>
        <p>
          <img src='https://cdn.pixabay.com/photo/2023/04/06/01/26/heart-7902540_960_720.jpg' />
        </p>
      </div>
    </>
  )
}

export default ProseMirrorEditor

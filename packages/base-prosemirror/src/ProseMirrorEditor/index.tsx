import { useEffect, useRef } from 'react'
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { DOMParser } from 'prosemirror-model'
import 'prosemirror-view/style/prosemirror.css'
import { undo, redo, history } from 'prosemirror-history'
import { baseKeymap } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
import createBlockMenu from './plugins/block-menu'
import createUploadHolder from './plugins/upload-holder'
import bubbleMenu from './plugins/bubble-menu'
import schema from './schema'
import EditorStyles from './EditorStyles'

const ProseMirrorEditor = () => {
  const viewDomRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView>()

  useEffect(() => {
    if (viewDomRef.current) {
      let state = EditorState.create({
        doc: DOMParser.fromSchema(schema).parse(document.querySelector("#content")!),
        schema,
        plugins: [
          history(),
          bubbleMenu,
          createBlockMenu(),
          keymap(baseKeymap),
          createUploadHolder(),
          keymap({ "Mod-z": undo, "Mod-y": redo }),
        ],
      })
      
      /**
       * doc
       *  ul
       *  li
      */

      viewRef.current = new EditorView(viewDomRef.current, {
        state,
        dispatchTransaction(tr) {
          const newState = viewRef.current!.state.apply(tr)
          // console.log('doc', newState.doc)
          const { $from, $to } = newState.selection
          const range = $from.blockRange($to)
          console.log(range, $from, $to)
          viewRef.current?.updateState(newState)
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
        <p>1.0123456789</p>
        <p>2.0123456789</p>
        <hr />
        <p>3.0123456789</p>
        <img src='https://cdn.pixabay.com/photo/2023/04/06/01/26/heart-7902540_960_720.jpg' />
        <p>4.0123456789</p>
        <ul>
          <p>2234234</p>
          <li>列表</li>
          <li>列表</li>
        </ul>
        <ol>
          <li>列表</li>
          <li>列表</li>
        </ol>
      </div>
    </>
  )
}

export default ProseMirrorEditor

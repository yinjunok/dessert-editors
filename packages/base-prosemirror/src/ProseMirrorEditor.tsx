import { useEffect, useRef } from 'react'
import { schema } from "prosemirror-schema-basic"
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import 'prosemirror-view/style/prosemirror.css'

let state = EditorState.create({ schema })

const ProseMirrorEditor = () => {
  const viewDomRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView>()

  useEffect(() => {
    if (viewDomRef.current) {
      viewRef.current = new EditorView(viewDomRef.current, { state })

      return () => {
        viewRef.current?.destroy()
      }
    }
  }, [])

  return (
    <div ref={viewDomRef} />
  )
}

export default ProseMirrorEditor

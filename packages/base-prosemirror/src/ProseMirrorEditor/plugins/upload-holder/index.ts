import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet, EditorView } from "prosemirror-view"
import { css } from '@emotion/css'
import uploadIcon from '../../assets/cloud-upload.svg?raw'

export const uploadHolderPluginKey = new PluginKey('upload-holder-key')
export const uploadHolderMetaKey = new PluginKey<UploadHolderMetaStateType>('upload-holder-meta-key')

export const findUploadHolder = (state: EditorState, id: UploadHolderMetaStateType['id']) => {
  const decos = uploadHolderPluginKey.getState(state) as DecorationSet

  if (decos) {
    const found = decos.find(undefined, undefined, h => h.id === id)
    return found.length ? found[0] : undefined
  }
}

const holderCss = css`
  border-radius: 4px;
  display: inline-flex;
  column-gap: 4px;
  padding: 0 4px;
  color: rgba(0, 0, 0, .85);
  background-color: #f5f5f5;
  align-items: center;
  font-size: .85em;
  margin: 0 .2em !important;
`

const createWidget = (meta: UploadHolderMetaStateType, pos?: number) => {
  const widget = document.createElement('uploadholder')
  widget.innerHTML = `${uploadIcon}<span>${meta.progress}%</span>`
  widget.classList.add(holderCss)
  return Decoration.widget(pos ?? meta.pos ?? 0, widget, { id: meta.id, onRemove: meta.onRemove })
}

export type UploadHolderMetaStateType = {
  id: string
  action: 'add' | 'remove' | 'update'
  progress?: number
  pos?: number
  onRemove?: () => void
}

const createUploadHolder = () => {
  return new Plugin({
    key: uploadHolderPluginKey,
    state: {
      init() {
        return DecorationSet.empty
      },
      apply(tr, holders, oldState) {
        const meta: UploadHolderMetaStateType = tr.getMeta(uploadHolderMetaKey)

        const newHolders = holders.map(
          tr.mapping,
          tr.doc,
          {
            onRemove(decorationSpec) {
              decorationSpec?.onRemove()
            }
          }
        )
        if (meta) {
          if (meta.action === 'add') {
            const widget = createWidget(meta)
            return newHolders.add(tr.doc, [widget])
          }

          if (meta.action === 'update') {
            const oldDeco = findUploadHolder(oldState, meta.id)
            if (oldDeco) {
              const widget = createWidget(meta, oldDeco.from)
              return newHolders.remove([oldDeco]).add(tr.doc, [widget])
            }
          }

          if (meta.action === 'remove') {
            return newHolders.remove(newHolders.find(undefined, undefined, h => h.id === meta.id))
          }
        }

        return newHolders
      },
    },
    props: {
      decorations(state) {
        return uploadHolderPluginKey.getState(state)
      },
    }
  })
}

export default createUploadHolder

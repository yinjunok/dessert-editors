import { EditorState, Plugin, PluginKey, TextSelection } from 'prosemirror-state'
import { css } from '@emotion/css'
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view'
import { NodeType } from "prosemirror-model"
import { setBlockType, wrapIn } from 'prosemirror-commands'
import schema from '../../schema'
import pIcon from '../../assets/letter-p.svg?raw'
import heading1Icon from '../../assets/heading-1.svg?raw'
import heading2Icon from '../../assets/heading-1.svg?raw'
import heading3Icon from '../../assets/heading-1.svg?raw'
import heading4Icon from '../../assets/heading-1.svg?raw'
import separatorIcon from '../../assets/separator.svg?raw'
import codeIcon from '../../assets/code.svg?raw'
import quoteIcon from '../../assets/quote.svg?raw'
import photoIcon from '../../assets/photo.svg?raw'
import { uploadMock } from '../../utils'
import { uploadHolderMetaKey, uploadHolderPluginKey, findUploadHolder } from '../upload-holder'

const containerCss = css`
  position: absolute;
  z-index: 10;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #eee;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  display: none;
`

const placeholderCss = css`
  opacity: .65;
  padding-left: .5em;
  pointer-events: none;
`

const menuVisible = css`
  display: grid;
`

const menuCss = css`
  padding: 8px 12px 8px 10px;
  display: grid;
  grid-template-columns: 1em max-content;
  gap: 8px;
  cursor: pointer;
  align-items: center;
  border-left: 2px solid transparent;
  
  &:hover,
  &.selected {
    background-color: #f3f3f3;
  }

  &.active {
    border-color: blue;
  }
`

type MenuItem = {
  label: string
  icon: string
  dom: HTMLDivElement
  nodeType: NodeType
  shortcut: string
  command: ReturnType<typeof setBlockType>
}

type BlockMenuState = {
  from: number
  active: boolean
  menuIndex: number
}

const clearnCommandText = (pluginState: BlockMenuState, view: EditorView) => {
  if (pluginState.from && pluginState.from < view.state.selection.from) {
    const selection = new TextSelection(view.state.tr.doc.resolve(pluginState.from), view.state.tr.doc.resolve(view.state.selection.from))
    view.dispatch(
      view.state.tr.setSelection(selection).deleteSelection()
    )
  }
}

export const blockMenuMetaKey = new PluginKey('block-menu-meta-key')
export const blockMenuPluginKey = new PluginKey<BlockMenuState>('block-menu-key')

const createBlockMenu = () => {
  const menus: MenuItem[] = [
    {
      label: '标题1',
      shortcut: 'h1',
      icon: heading1Icon,
      dom: document.createElement('div'),
      nodeType: schema.nodes.heading,
      command: setBlockType(schema.nodes.heading, { level: 1 }),
    },
    {
      label: '标题2',
      shortcut: 'h2',
      icon: heading2Icon,
      dom: document.createElement('div'),
      nodeType: schema.nodes.heading,
      command: setBlockType(schema.nodes.heading, { level: 2 }),
    },
    {
      label: '标题3',
      shortcut: 'h3',
      icon: heading3Icon,
      dom: document.createElement('div'),
      nodeType: schema.nodes.heading,
      command: setBlockType(schema.nodes.heading, { level: 3 }),
    },
    {
      label: '标题4',
      shortcut: 'h4',
      icon: heading4Icon,
      dom: document.createElement('div'),
      nodeType: schema.nodes.heading,
      command: setBlockType(schema.nodes.heading, { level: 4 }),
    },
    {
      label: '段落',
      shortcut: 'paragraph',
      icon: pIcon,
      dom: document.createElement('div'),
      nodeType: schema.nodes.paragraph,
      command: setBlockType(schema.nodes.paragraph),
    },
    {
      label: '引用',
      shortcut: 'quotes',
      icon: quoteIcon,
      dom: document.createElement('div'),
      nodeType: schema.nodes.blockquote,
      command: wrapIn(schema.nodes.blockquote)
    },
    {
      label: '代码',
      shortcut: 'code',
      icon: codeIcon,
      dom: document.createElement('div'),
      nodeType: schema.nodes.code_block,
      command: setBlockType(schema.nodes.code_block),
    },
    {
      label: '图片',
      shortcut: 'image',
      icon: photoIcon,
      dom: document.createElement('div'),
      nodeType: schema.nodes.image,
      command: (state: EditorState, dispatch?: EditorView['dispatch'], view?: EditorView) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.style.display = 'none'
        document.body.appendChild(input)
        input.click()

        input.onchange = (e) => {
          const target = e.target as HTMLInputElement
          const file = target.files?.[0]
          const id = Math.random().toString()
          if (file) {
            uploadMock({
              file,
              onStart() {
                if (view) {
                  view.dispatch(
                    view.state.tr.setMeta(uploadHolderMetaKey, { id, action: 'add', progress: 0, pos: state.selection.from })
                  )
                }
              },
              onProgress(percent) {
                if (view) {
                  view.dispatch(
                    view.state.tr.setMeta(uploadHolderMetaKey, { id, action: 'update', progress: percent, pos: state.selection.from })
                  )
                }
              },
              onError() {
                if (view) {
                  view.state.tr.setMeta(uploadHolderMetaKey, { id, action: 'remove' })
                }
              },
              onSuccess(path) {
                if (view) {
                  const holder = findUploadHolder(view.state, id)
                  if (holder) {
                    view.dispatch(
                      view.state.tr.setMeta(uploadHolderMetaKey, { id, action: 'remove' })
                                   .insert(holder.from, schema.nodes.image.create({ src: path, title: file.name, alt: file.name }))
                    )
                  }
                }
              },
            })
          }
        }

        input.remove()
        return true
      }
    },
    {
      label: '分割线',
      shortcut: 'divider',
      icon: separatorIcon,
      dom: document.createElement('div'),
      nodeType: schema.nodes.horizontal,
      command: (state: EditorState, dispatch?: EditorView['dispatch'], view?: EditorView) => {
        if (dispatch) {
          const { from } = state.selection
          dispatch(state.tr.insert(from, schema.nodes.horizontal.create()))
        }
        return true
      }
    }
  ]

  return new Plugin<BlockMenuState>({
    state: {
      init() {
        return {
          from: 0,
          menuIndex: 0,
          active: false,
        }
      },
      apply(tr, value) {
        const meta = tr.getMeta(blockMenuMetaKey)
        return meta ? { ...value, ...meta } : value
      }
    },
    key: blockMenuPluginKey,
    view(view) {
      const menuContainer = document.createElement('div')
      menuContainer.classList.add(containerCss)

      menus.forEach(m => {
        m.dom.classList.add(menuCss)
        m.dom.title = m.label
        m.dom.innerHTML = `${m.icon} <span>${m.label}</span>`
        m.dom.addEventListener('mousedown', e => {
          e.preventDefault()
          e.stopPropagation()
          view.focus()
          const pluginState = blockMenuPluginKey.getState(view.state)
          if (pluginState) {
            clearnCommandText(pluginState, view)
          }
          m.command(view.state, view.dispatch, view)
          view.dispatch(view.state.tr.setMeta(blockMenuMetaKey, { menuIndex: 0, active: false }))
        })
        menuContainer.appendChild(m.dom)
      })

      document.body.appendChild(menuContainer)

      const hiddenMenu = () => {
        const pluginState = blockMenuPluginKey.getState(view.state)
        if (pluginState && pluginState.active) {
          view.dispatch(view.state.tr.setMeta(blockMenuMetaKey, { menuIndex: 0, active: false }))
        }
      }
      document.addEventListener('mousedown', hiddenMenu)

      const updateMenu = () => {
        const pluginState = blockMenuPluginKey.getState(view.state)
        if (pluginState) {
          menus.forEach((m, i) => {
            if (i === pluginState.menuIndex) {
              m.dom.classList.add('selected')
            } else {
              m.dom.classList.remove('selected')
            }
            menuContainer.appendChild(m.dom)
          })
        }
      }

      return {
        update(view) {
          const pluginState = blockMenuPluginKey.getState(view.state)
          if (!pluginState) {
            return
          }

          const { selection } = view.state
          if (!pluginState.active) {
            menuContainer.classList.remove(menuVisible)
            return
          }

          updateMenu()
          menuContainer.classList.add(menuVisible)
          const { from } = selection
          const pos = view.coordsAtPos(from)
          menuContainer.style.left = `${window.scrollX + pos.left}px`
          menuContainer.style.top = `${window.scrollY + pos.bottom}px`
        },
        destroy() {
          menuContainer.remove()
          document.removeEventListener('mousedown', hiddenMenu)
        }
      }
    },
    props: {
      handleKeyDown(view, event) {
        const code = event.code
        const tr = view.state.tr
        if (code === 'Slash') {
          view.dispatch(tr.setMeta(blockMenuMetaKey, { active: true, from: view.state.selection.from }))
          return false
        }

        const pluginState = blockMenuPluginKey.getState(view.state)
        if (pluginState && pluginState.active) {
          if (code === 'ArrowUp') {
            if (pluginState.menuIndex === 0) {
              view.dispatch(tr.setMeta(blockMenuMetaKey, { menuIndex: menus.length - 1 }))
            } else {
              view.dispatch(tr.setMeta(blockMenuMetaKey, { menuIndex: pluginState.menuIndex - 1 }))
            }
            return true
          }
          if (code === 'ArrowDown') {
            if (pluginState.menuIndex === menus.length - 1) {
              view.dispatch(tr.setMeta(blockMenuMetaKey, { menuIndex: 0 }))
            } else {
              view.dispatch(tr.setMeta(blockMenuMetaKey, { menuIndex: pluginState.menuIndex + 1 }))
            }
            return true
          }

          if (code === 'Enter' && menus.length !== 0) {
            clearnCommandText(pluginState, view)
            menus[pluginState.menuIndex].command(view.state, view.dispatch, view)
            view.dispatch(view.state.tr.setMeta(blockMenuMetaKey, { active: false, menuIndex: 0 }))
            return true
          }

          if (code === 'Space') {
            view.dispatch(tr.setMeta(blockMenuMetaKey, { menuIndex: 0, active: false }))
            return false
          }
        }
        return false
      },
      decorations(state) {
        const { selection } = state
        if (selection.empty) {
          const { $from } = selection
          if (
            $from.depth === 1 &&
            $from.parent.type.name === 'paragraph' &&
            $from.parent.content.size === 0
          ) {
            const placeholder = document.createElement('placeholder')
            placeholder.textContent = '输入 / 打开更多菜单'
            placeholder.classList.add(placeholderCss)
            return DecorationSet.create(state.doc, [Decoration.widget($from.pos, placeholder)])
          }
        }
      },
    }
  })
}

export default createBlockMenu

import { EditorView } from "prosemirror-view"
import { EditorState, Plugin } from 'prosemirror-state'
import { toggleMark } from 'prosemirror-commands'
import { css } from '@emotion/css'
import { MarkType } from "prosemirror-model"
import { markActive } from '../../utils'
import boldIcon from '../../assets/bold.svg?raw'
import italicIcon from '../../assets/italic.svg?raw'
import codeIcon from '../../assets/code.svg?raw'
import underlineIcon from '../../assets/underline.svg?raw'
import schema from "../../schema"

const bubble = css`
  position: absolute;
  z-index: 20;
  background-color: white;
  border-radius: 4px;
  z-index: 9;
  border: 1px solid #eee;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  padding: 4px;
  gap: 2px;
`

const buttonCss = css`
  outline: none;
  border: none;
  display: inline-flex;
  align-items: center;
  padding: 4px 6px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
  background-color: #fff;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.08);
  }

  &.active {
    background-color: rgba(0, 0, 0, 0.1);
  }
`

type MenuItem = {
  label: string
  icon: string
  dom: HTMLButtonElement
  markType: MarkType
  command: ReturnType<typeof toggleMark>
}

class BubbleMenu {
  private bubble: HTMLElement = document.createElement('div')
  private items: MenuItem[] = [
    {
      label: '加粗',
      icon: boldIcon,
      dom: document.createElement('button'),
      markType: schema.marks.bold,
      command: toggleMark(schema.marks.bold)
    },
    {
      label: '斜体',
      icon: italicIcon,
      dom: document.createElement('button'),
      markType: schema.marks.italic,
      command: toggleMark(schema.marks.italic)
    },
    {
      label: '代码',
      icon: codeIcon,
      dom: document.createElement('button'),
      markType: schema.marks.code,
      command: toggleMark(schema.marks.code)
    },
    {
      label: '下划线',
      icon: underlineIcon,
      dom: document.createElement('button'),
      markType: schema.marks.underline,
      command: toggleMark(schema.marks.underline)
    }
  ]
  
  constructor(private view: EditorView) {
    this.bubble.classList.add(bubble)
    document.body.appendChild(this.bubble)

    this.items.forEach(item => {
      item.dom.classList.add(buttonCss)
      item.dom.title = item.label
      item.dom.innerHTML = item.icon
      item.dom.addEventListener('mousedown', (e) => {
        e.preventDefault()
        view.focus()
        item.command(view.state, view.dispatch, view)
      })
      this.bubble.appendChild(item.dom)
    })
  }

  private updateMenu = () => {
    this.items.forEach(({ dom, markType }) => {
      const isActive = markActive(this.view.state, markType)
      isActive ? dom.classList.add('active') : dom.classList.remove('active')
    })
  }

  update(view: EditorView, lastState: EditorState): void {
    const state = view.state

    if (
      lastState &&
      lastState.doc.eq(state.doc) &&
      lastState.selection.eq(state.selection)
    ) {
      return
    }
    const { $from, $to } = view.state.selection
    if (state.selection.empty || !$from.parent.eq($to.parent)) {
      this.bubble.style.display = 'none'
      return
    }
    this.updateMenu()
    this.bubble.style.display = ''
    const { from, to } = state.selection
    const bubbleRect = this.bubble.getBoundingClientRect()
    const start = view.coordsAtPos(from)
    const end = view.coordsAtPos(to)
    const top = window.scrollY + Math.min(start.top, end.top) - (bubbleRect.height * 1.3)
    const left = window.scrollX + Math.min(start.left, end.left) - ((bubbleRect.width - (end.left - start.left)) / 2)
    this.bubble.style.left = `${left}px`
    this.bubble.style.top = `${top}px`
  }

  destroy() {
    this.bubble.remove()
  }
}

export default new Plugin({
  view(view) {
    return new BubbleMenu(view)
  },
})

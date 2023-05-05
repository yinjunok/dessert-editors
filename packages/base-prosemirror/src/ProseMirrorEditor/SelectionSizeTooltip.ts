import { EditorView } from "prosemirror-view"
import { EditorState, Plugin } from 'prosemirror-state'
import { css } from "@emotion/css"

const tooltipCss = css`
  position: absolute;
  pointer-events: none;
  z-index: 20;
  background: white;
  border: 1px solid silver;
  border-radius: 2px;
  padding: 2px 10px;
  margin-bottom: 7px;
  transform: translateX(-50%);
`

class SelectionSizeTooltip {
  private tooltip: HTMLDivElement
  constructor(private view: EditorView) {
    this.tooltip = document.createElement("div")
    this.tooltip.classList.add(tooltipCss)
    this.view.dom.parentNode?.appendChild(this.tooltip)

    this.update(view)
  }

  update(view: EditorView, lastState?: EditorState) {
    let state = view.state
    // 如果文档或者选区未发生更改，则什么不做
    if (
      lastState && lastState.doc.eq(state.doc) &&
      lastState.selection.eq(state.selection)
    ) {
      return
    }

    // 如果选区为空（光标状态）则隐藏 tooltip
    if (state.selection.empty) {
      this.tooltip.style.display = "none"
      return
    }

    // 否则，重新设置它的位置并且更新它的内容
    this.tooltip.style.display = ""
    let { from, to } = state.selection
    // 这些是在屏幕上的坐标信息
    const start = view.coordsAtPos(from)
    const end = view.coordsAtPos(to)
    // 将 tooltip 所在的父级节点作为参照系
    let box = this.tooltip.offsetParent?.getBoundingClientRect()
    // 寻找 tooltip 的中点，当跨行的时候，端点可能更靠近左侧
    let left = Math.max((start.left + end.left) / 2, start.left + 3)
    this.tooltip.style.left = (left - (box?.left ?? 0)) + "px"
    this.tooltip.style.bottom = ((box?.bottom ?? 0) - start.top) + "px"
    this.tooltip.textContent = `${to - from}`
  }

  destroy() { this.tooltip.remove() }
}

export default new Plugin({
  view(view) {
    return new SelectionSizeTooltip(view)
  },
})
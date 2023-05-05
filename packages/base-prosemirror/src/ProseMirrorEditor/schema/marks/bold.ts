import { MarkSpec } from 'prosemirror-model'

const strong: MarkSpec = {
  parseDOM: [
    { tag: 'strong' },
    { tag: "b", getAttrs: (node) => typeof node !== 'string' && node.style.fontWeight != "normal" && null },
    { style: "font-weight=400", clearMark: m => m.type.name == "strong" },
    { style: "font-weight", getAttrs: (value) => typeof value === 'string' && /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null },
  ],
  toDOM: () => ['strong', 0]
}

export default strong

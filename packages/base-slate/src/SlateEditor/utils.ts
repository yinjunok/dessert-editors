import { Descendant, Node } from 'slate'

export const serialize = (val: Descendant[]) => {
  return val.map(n => Node.string(n)).join('\n')
}

export const deserialize  = (str: string) => {
  return str.split('\n').map(line => ({ type: 'paragraph', children: [{ text: line }] }))
}

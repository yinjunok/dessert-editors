import { Descendant, Node } from 'slate'
import type { BaseElement, ElementType } from './types'

export const serialize = (val: Descendant[]) => {
  return val.map(n => Node.string(n)).join('\n')
}

export const deserialize  = (str: string) => {
  return str.split('\n').map(line => ({ type: 'paragraph', children: [{ text: line }] }))
}

export const createBaseElement = (params?: Partial<Omit<BaseElement, 'type'>>): Omit<BaseElement, 'type'> => ({
  isInline: false,
  isVoid: false,
  markableVoid: true,
  children: [{ text: '' }],
  ...params
})

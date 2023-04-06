import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor
export type FormattedText = {
  text: string
  bold?: true
  code?: true
  color?: string
  backgroundColor?: string
  italic?: true
  underline?: true
  strikethrough?: true
}
export type TextFormatType = Exclude<keyof FormattedText, 'text'>
export type CustomText = FormattedText
export type BaseElement = {
  type: string
  children: CustomText[]
  [P: string]: any
}

export type ParagraphElement = {
  type: 'paragraph'
} & BaseElement

export type HeadingElement = {
  type: 'heading'
  level: 1 | 2 | 3 | 4
} & BaseElement

export type CodeElement = {
  type: 'code'
} & BaseElement

export type QuotesElement = {
  type: 'quotes'
} & BaseElement

export type DividerElement = {
  type: 'divider'
} & BaseElement

export type CustomElement = ParagraphElement | HeadingElement | CodeElement | QuotesElement | DividerElement

export type ElementType = CustomElement['type']

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}

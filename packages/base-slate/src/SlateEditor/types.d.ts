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
export type BaseElement<Child = CustomText> = {
  type: string
  isInline: boolean
  isVoid: boolean
  markableVoid: boolean
  children: Child[]
}

export type ParagraphElement = {
  type: 'paragraph'
} & BaseElement

export type HeadingElement = {
  type: 'h1' | 'h2' | 'h3' | 'h4'
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

export type ListItemElement = {
  type: 'list-item'
} & BaseElement

export type NumberedListElement = {
  type: 'numbered-list',
} & BaseElement<ListItemElement>

export type BulletedListElement = {
  type: 'bulleted-list',
} & BaseElement<ListItemElement>

export type ImageElement = {
  type: 'image'
  url: string
} & BaseElement

export type UploadHolder = {
  type: 'upload-holder'
  id: string
} & BaseElement

export type CustomElement = UploadHolder | ImageElement | BulletedListElement | ParagraphElement | HeadingElement | CodeElement | QuotesElement | DividerElement | ListItemElement | NumberedListElement

export type ElementType = CustomElement['type']

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}

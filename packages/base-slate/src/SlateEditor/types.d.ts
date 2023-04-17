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
export type Children = (CustomText| InlineElement)[]

type Distribute<U> = U extends any ? {type: U} : never;
type IsInline<T> = T['isInline'] extends true ? T : never
type InlineElement = LinkElement

export type ParagraphElement = {
  type: 'paragraph'
  isInline: false
  isVoid: false
  markableVoid: false
  children: Children
}

export type HeadingElement = {
  type: 'h1' | 'h2' | 'h3' | 'h4'
  isInline: false
  isVoid: false
  markableVoid: false
  children: Children
}

export type CodeElement = {
  type: 'code'
  isInline: false
  isVoid: false
  markableVoid: false
  children: Children
}

export type QuotesElement = {
  type: 'quotes'
  isInline: false
  isVoid: false
  markableVoid: false
  children: Children
}

export type DividerElement = {
  type: 'divider'
  isInline: false
  isVoid: true
  markableVoid: false
  children: Children
}

export type ListItemElement = {
  type: 'list-item'
  isInline: false
  isVoid: false
  markableVoid: false
  children: Children
}

export type NumberedListElement = {
  type: 'numbered-list'
  isInline: false
  isVoid: false
  markableVoid: false
  children: ListItemElement[]
}

export type BulletedListElement = {
  type: 'bulleted-list'
  isInline: false
  isVoid: false
  markableVoid: false
  children: ListItemElement[]
}

export type ImageElement = {
  type: 'image'
  url: string
  alt: string
  isInline: false
  isVoid: true
  markableVoid: false
  children: Children
}

export type LinkElement = {
  type: 'link'
  url: string
  title: string
  isInline: true
  isVoid: false
  markableVoid: false
  children: Children
}

export type UploadHolder = {
  type: 'upload-holder'
  id: string
  isInline: false
  isVoid: true
  markableVoid: false
  children: Children
}

export type CustomElement = 
  LinkElement
| UploadHolder
| ImageElement
| BulletedListElement
| ParagraphElement
| HeadingElement
| CodeElement
| QuotesElement
| DividerElement
| ListItemElement
| NumberedListElement

export type ElementType = CustomElement['type']

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}

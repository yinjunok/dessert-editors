import type { LexicalEditor } from 'lexical'

export type MenuItemType = {
  label: string
  type: string
  shortcut: string
  command: () => void
  icon?: React.ReactNode
}
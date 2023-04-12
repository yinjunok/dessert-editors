import { createContext } from 'react'

export type UploadItemType = {
  id: string
  progress: number
  url?: string
  status: 'done' | 'doing'
  // onStart: () => void
  // onProgress: () => void
  // onSuccess: () => void
  // onError: () => void
}

export type StoreType = {
  uploads: UploadItemType[]
  addUploadItem: (item: UploadItemType) => void
  removeUploadItem: (id: UploadItemType['id']) => void
  updateUploadItem: (item: UploadItemType) => void
  getUploadItem: (id: string) => UploadItemType | undefined
}

const noop = () => {}

const context = createContext<StoreType>({
  uploads: [],
  getUploadItem: () => undefined,
  addUploadItem: noop,
  removeUploadItem: noop,
  updateUploadItem: noop,
})

export default context

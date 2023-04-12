import { FC, useContext, useEffect, useMemo } from 'react'
import { Transforms } from 'slate'
import { RenderElementProps, ReactEditor, useSlateStatic } from 'slate-react'
import Ctx from '../../context'
import type { UploadHolder as UploadHolderType } from '../../types'

const UploadHolder: FC<RenderElementProps> = ({ attributes, element, children }) => {
  const ele = element as UploadHolderType
  const ctx = useContext(Ctx)
  const editor = useSlateStatic()
  const upload = ctx.getUploadItem(ele.id)
  const progress = useMemo(() => upload?.progress ?? 0, [upload])

  useEffect(() => {
    if (upload && upload.status === 'done') {
      const path = ReactEditor.findPath(editor, element)
      Transforms.setNodes(editor, {
        type: 'image',
        url: upload.url
      }, {
        at: path
      })
    }
  }, [upload, element, editor])

  return (
    <div
      contentEditable={false}
      {...attributes}
      className='my-4'
    >
      <div className='p-4 bg-slate-100 rounded flex items-center gap-x-2'>
        <div
          className='h-2 rounded bg-sky-500 flex-1 overflow-hidden transition-all'
          style={{
            clipPath: `polygon(0% 0%, ${progress}% 0%, ${progress}% 100%, 0% 100%)`
          }}
        />
        <span>
          {progress.toFixed(2) ?? 0}%
        </span>
      </div>
      {children}
    </div>
  )
}

export default UploadHolder

import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { TbX } from 'react-icons/tb'
import { ImagePayload } from './index'
import { upload } from '../../utils/uploadMock'
import './styles.scss'

const useInsertImageModal = (onConfirm: (payload: ImagePayload) => void): [React.ReactPortal, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [open, setOpen] = useState<boolean>(false)
  const [type, setType] = useState<'url' | 'file'>('url')
  const [progress, setProgress] = useState<number | null>(null)
  const cancelUploadRef = useRef<ReturnType<typeof upload> | null>(null)
  const [payload, setPayload] = useState<ImagePayload>({
    src: '',
    alt: ''
  })

  useEffect(() => {
    if (!open) {
      setProgress(null)
      setType('url')
      setPayload({
        src: '',
        alt: ''
      })
      if (cancelUploadRef.current) {
        cancelUploadRef.current()
      }
    }
  }, [open])

  const modal = open ? (
    <>
      <div className='insert-image-modal'>
        <div className='insert-image-header'>
          <div className='insert-image-tab'>
            <div className={clsx({ active: type === 'url' })} onClick={() => setType('url')}>URL</div>
            <div className={clsx({ active: type === 'file' })} onClick={() => setType('file')}>文件</div>
          </div>
          <button
            className='insert-image-close'
            onClick={() => {
              setOpen(false)
            }}
          >
            <TbX />
          </button>
        </div>

        <div className='insert-image-body'>
          <div className='insert-image-form'>
            {
              type === 'url' && (
                <>
                  <label>URL</label>
                  <input
                    value={payload.src}
                    className='insert-image-input'
                    onChange={e => {
                      setPayload(state => ({ ...state, src: e.target.value }))
                    }}
                  />
                </>
              )
            }

            {
              type === 'file' && (
                <>
                  <label>文件</label>
                  <input
                    type='file'
                    accept='image/*'
                    className='insert-image-input'
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) {
                        cancelUploadRef.current = upload({
                          file,
                          onProgress(percent) {
                            setProgress(percent)
                          },
                          onSuccess(url) {
                            setProgress(null)
                            setPayload(state => ({ ...state, src: url }))
                          },
                        })
                      }
                    }}
                  />
                </>
              )
            }

            <label>ALT</label>
            <input
              value={payload.alt}
              className='insert-image-input'
              onChange={e => {
                setPayload(state => ({ ...state, alt: e.target.value }))
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 8,
              marginTop: 16,
            }}
          >
            {
              progress && <span style={{ fontSize: 12, color: 'rgba(0, 0, 0, .45)' }}>{progress}%</span>
            }
            <button
              className='insert-image-btn'
              disabled={payload.src === ''}
              onClick={() => {
                onConfirm(payload)
              }}
            >
              确定
            </button>
          </div>
        </div>
      </div>
      <div className='insert-image-modal-mask' />
    </>
  ) : null

  return [
    createPortal(modal, document.body),
    setOpen
  ]
}

export default useInsertImageModal

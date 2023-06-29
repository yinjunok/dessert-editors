import { timer, interval, takeUntil, timeInterval, scan } from 'rxjs'

export type UploadParams = {
  file: File
  onSuccess?: (url: string) => void
  onProgress?: (percent: number) => void
  onError?: (err: Error) => void
} 

const noop = () => {}

export const upload = ({
  file,
  onError = noop,
  onProgress = noop,
  onSuccess = noop,
}: UploadParams) => {
  const total = 1000 * 10

  const subscribe = interval(100).pipe(
    timeInterval(),
    scan((acc, cur) => acc + cur.interval, 0),
    takeUntil(timer(total)),
  ).subscribe({
    next(v) {
      onProgress(parseFloat(((v / total) * 100).toFixed(2)))
    },
    error(err) {
      onError(err)
    },
    complete() {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onSuccess(reader.result)
        }
      }
      reader.readAsDataURL(file)
    },
  })

  return subscribe.unsubscribe
}

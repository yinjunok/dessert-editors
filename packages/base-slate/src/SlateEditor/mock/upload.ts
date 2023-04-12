import { finalize, interval, takeUntil, tap, timer } from 'rxjs'

export type UploadParams = {
  file: File
  onError?: () => void
  onSuccess?: (url: string) => void
  onProgress?: (percent: number) => void
}

const upload = (params: UploadParams) => {
  const { file, onError: _, onSuccess, onProgress } = params
  interval(100).pipe(
    tap(time => {
      if (onProgress) {
        onProgress((time / 50) * 100)
      }
    }),
    takeUntil(timer(5000)),
    finalize(() => {
      const url = URL.createObjectURL(file)
      if (onSuccess) {
        onSuccess(url)
      }
    })
  ).subscribe()
}

export default upload
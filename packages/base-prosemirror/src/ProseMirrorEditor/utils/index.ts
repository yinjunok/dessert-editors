import { EditorState } from 'prosemirror-state'
import { MarkType } from 'prosemirror-model'
import { tap, interval, timer, takeUntil, finalize, timeInterval, scan } from 'rxjs'

export const markActive = (state: EditorState, type: MarkType) => {
  const { from, $from, to, empty } = state.selection
  if (empty) {
    return !!type.isInSet($from.marks())
  }
  return state.doc.rangeHasMark(from, to, type)
}

export type UploadMockParams = {
  file: File
  onStart?: () => void
  onSuccess?: (path: string) => void
  onError?: (err: Error) => void
  onProgress?: (percent: number) => void
}

export const noop = () => {}

export const uploadMock = ({
  file,
  onStart = noop,
  onError = noop,
  onSuccess = noop,
  onProgress = noop,
}: UploadMockParams) => {
  onStart()
  const subscription = interval(500).pipe(
    timeInterval(),
    scan((acc, cur) => acc + cur.interval, 0),
    tap(v => {
      const percent = ((v / 10000) * 100).toFixed(2)
      onProgress(parseFloat(percent))
    }),
    takeUntil(timer(10000)),
    finalize(() => {
      onSuccess(URL.createObjectURL(file))
    }),
    tap({
      error(err) {
        onError(err)
      },
    })
  ).subscribe(v => {

  })

  return subscription.unsubscribe
}

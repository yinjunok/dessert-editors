import { Subject } from 'rxjs'

const keyDownSubject = new Subject<KeyboardEvent>()
export default keyDownSubject

import { useState, useCallback } from 'react'

const useForceUpdate = () => {
  const [_, setUpdate] = useState<string>()

  const forceUpdate = useCallback(() => {
    setUpdate(Math.random().toString())
  }, [])

  return forceUpdate
}

export default useForceUpdate

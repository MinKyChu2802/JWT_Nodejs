import { useEffect } from 'react'
import { isSsr } from 'utils/common'
import { create } from 'zustand'

export const useWindowSize = create<{
  windowSize: number
  update: (value: number) => void
}>((set) => ({
  windowSize: isSsr ? 0 : window.innerWidth,
  update: (windowSize) => set((state) => ({ ...state, windowSize })),
}))

export const WindowSizeWrapper = () => {
  const { update } = useWindowSize()

  useEffect(() => {
    if (isSsr) return

    const handleResize = () => {
      update(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [update])

  return null
}

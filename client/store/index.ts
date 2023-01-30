import { UserInfo } from 'types/common'
import create from 'zustand'

export const useStore = create<{
  userInfo: UserInfo | null
  update: (userInfo: UserInfo) => void
}>((set) => ({
  userInfo: null,
  update: (userInfo: UserInfo) => set((state) => ({ ...state, userInfo })),
}))

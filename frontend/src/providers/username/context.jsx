import { createContext } from 'react'

const defaultUsernameContext = {
  isUsernameSet: false,
  username: '',
  setUsername: () => {}
}

export const UsernameContext = createContext(defaultUsernameContext)

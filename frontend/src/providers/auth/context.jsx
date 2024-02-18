import { createContext } from 'react'

const defaultAuthContext = {
  isLogged: false,
  login: () => {},
  logout: () => {}
}

export const AuthContext = createContext(defaultAuthContext)

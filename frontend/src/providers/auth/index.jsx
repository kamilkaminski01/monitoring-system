import { useState, useEffect, useCallback } from 'react'
import { LOCAL_STORAGE } from 'utils/consts'
import { AuthContext } from './context'

const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem(LOCAL_STORAGE.accessToken))

  const login = useCallback(() => {
    setIsLogged(true)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE.accessToken)
    localStorage.removeItem(LOCAL_STORAGE.refreshToken)
    setIsLogged(false)
  }, [])

  useEffect(() => {
    const onStorageChange = () => {
      const newAccessToken = localStorage.getItem(LOCAL_STORAGE.accessToken)
      if (!newAccessToken) setIsLogged(false)
    }
    window.addEventListener('storage', onStorageChange)
    return () => {
      window.removeEventListener('storage', onStorageChange)
    }
  }, [])

  return <AuthContext.Provider value={{ isLogged, login, logout }}>{children}</AuthContext.Provider>
}

export default AuthProvider

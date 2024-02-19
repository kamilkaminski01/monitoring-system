import { useState, useEffect, useCallback } from 'react'
import { LOCAL_STORAGE, PATHS } from 'utils/consts'
import { AuthContext } from './context'
import { useNavigate } from 'react-router-dom'

const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem(LOCAL_STORAGE.accessToken))

  const login = useCallback(() => {
    setIsLogged(true)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE.accessToken)
    localStorage.removeItem(LOCAL_STORAGE.refreshToken)
    setIsLogged(false)
    navigate(PATHS.home)
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

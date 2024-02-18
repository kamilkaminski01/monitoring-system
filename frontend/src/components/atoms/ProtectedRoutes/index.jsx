import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { PATHS } from 'utils/consts.js'
import { AuthContext } from 'providers/auth/context'

const ProtectedRoutes = () => {
  const { isLogged } = useContext(AuthContext)
  return isLogged ? <Outlet /> : <Navigate to={PATHS.login} />
}

export default ProtectedRoutes

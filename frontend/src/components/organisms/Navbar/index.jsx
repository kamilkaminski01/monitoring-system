import { Link, NavLink } from 'react-router-dom'
import './style.scss'
import { PATHS } from 'utils/consts'
import { AuthContext } from 'providers/auth/context'
import { useContext } from 'react'

const Navbar = () => {
  const { isLogged, logout } = useContext(AuthContext)

  return (
    <nav>
      <Link to={PATHS.home} className="nav__brand">
        Monitoring System
      </Link>
      <div className="nav__menu">
        {isLogged ? (
          <>
            <NavLink
              to={PATHS.monitoring}
              className={({ isActive }) => (isActive ? 'active-link' : '')}>
              Monitoring Panel
            </NavLink>
            <span onClick={logout}>Logout</span>
          </>
        ) : (
          <NavLink to={PATHS.login}>Login</NavLink>
        )}
      </div>
    </nav>
  )
}

export default Navbar

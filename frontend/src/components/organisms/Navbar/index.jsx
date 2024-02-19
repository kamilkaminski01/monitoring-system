import { Link, NavLink } from 'react-router-dom'
import './style.scss'
import { PATHS } from 'utils/consts'
import { AuthContext } from 'providers/auth/context'
import { useContext } from 'react'

const Navbar = () => {
  const { isLogged, logout } = useContext(AuthContext)

  return (
    <nav>
      <Link to={PATHS.home} className="site-title">
        Monitoring System
      </Link>
      <ul>
        {isLogged ? (
          <>
            <li>
              <NavLink
                to={PATHS.monitoring}
                className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')}>
                Monitoring Panel
              </NavLink>
            </li>
            <li>
              <span onClick={logout}>Logout</span>
            </li>
          </>
        ) : (
          <li>
            <NavLink to={PATHS.login}>Login</NavLink>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar

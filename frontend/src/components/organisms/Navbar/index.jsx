import { Link, NavLink } from 'react-router-dom'
import './style.scss'
import { PATHS } from 'utils/consts'
import { AuthContext } from 'providers/auth/context'
import { useContext } from 'react'
import Logo from 'assets/icons/logo.svg'

const Navbar = () => {
  const { isLogged, logout } = useContext(AuthContext)

  return (
    <nav>
      <Link to={PATHS.home} className="nav__brand">
        <img className="nav__brand-logo" src={Logo} alt="logo" /> Monitoring System
      </Link>
      <div className="nav__menu">
        <NavLink to={PATHS.about} className={({ isActive }) => (isActive ? 'active-link' : '')}>
          About
        </NavLink>
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

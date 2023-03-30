import { Link, NavLink } from 'react-router-dom';
import './Navbar.scss';
import { PATHS } from 'utils/consts';
import { AuthContext } from 'providers/AuthContextProvider';
import { useContext } from 'react';

export default function Navbar() {
  const { isLogged, logout } = useContext(AuthContext);

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
              <Link onClick={logout}>Logout</Link>
            </li>
          </>
        ) : (
          <li>
            <NavLink to={PATHS.login}>Login</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

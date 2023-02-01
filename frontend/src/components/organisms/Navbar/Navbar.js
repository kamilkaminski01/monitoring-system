import { Link } from 'react-router-dom';
import './Navbar.css';
import { PATHS } from 'utils/consts';
import { AuthContext } from 'providers/AuthContextProvider';
import { useContext } from 'react';

export default function Navbar() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <nav className="nav">
      <Link to={PATHS.home} className="site-title">
        Monitoring System
      </Link>
      <ul>
        <li>
          {isAuthenticated ? (
            <Link to={PATHS.monitoring}>Monitoring Panel</Link>
          ) : (
            <Link to={PATHS.login}>Login</Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

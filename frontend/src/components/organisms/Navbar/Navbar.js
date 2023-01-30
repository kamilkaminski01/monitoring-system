import { Link } from 'react-router-dom';
import './Navbar.css';
import { PATHS } from 'utils/consts';

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to={PATHS.home} className="site-title">
        Monitoring System
      </Link>
      <ul>
        <li>
          <Link to={PATHS.monitoring}>Monitoring Panel</Link>
        </li>
      </ul>
    </nav>
  );
}

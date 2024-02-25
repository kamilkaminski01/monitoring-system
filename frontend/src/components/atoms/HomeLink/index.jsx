import './style.scss'
import { PATHS } from 'utils/consts'
import { Link } from 'react-router-dom'

const HomeLink = ({ className }) => {
  return (
    <Link to={PATHS.home} className={`home-link ${className}`}>
      Home
    </Link>
  )
}

export default HomeLink

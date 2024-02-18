import './style.scss'
import { PATHS } from 'utils/consts'
import { useNavigate } from 'react-router-dom'

const HomeButton = ({ className = null }) => {
  const navigate = useNavigate()
  return (
    <button className={`btn w-100 ${className || ''}`} onClick={() => navigate(PATHS.home)}>
      Home
    </button>
  )
}

export default HomeButton

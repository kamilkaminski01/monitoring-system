import './style.scss'
import { Link } from 'react-router-dom'

const Card = ({ title, imageUrl, text, link }) => {
  return (
    <Link to={link} className="card">
      <img src={imageUrl} className="card__img" alt="" />
      <h3 className="card__title">{title}</h3>
      <p className="card__desc">{text}</p>
    </Link>
  )
}

export default Card

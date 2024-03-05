import './style.scss'

const Box = ({ icon, title, description }) => {
  return (
    <div className="box">
      {icon}
      <h3 className="box__title">{title}</h3>
      <p className="box__description">{description}</p>
    </div>
  )
}

export default Box

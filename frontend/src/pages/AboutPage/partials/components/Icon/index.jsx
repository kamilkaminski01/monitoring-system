import './style.scss'

const Icon = ({ name, left, top, animationDelay, icon }) => {
  return (
    <div
      className="icon"
      style={{
        left,
        top,
        animation: `float 3s infinite linear ${animationDelay}`
      }}>
      <img src={icon} alt={name} />
    </div>
  )
}

export default Icon

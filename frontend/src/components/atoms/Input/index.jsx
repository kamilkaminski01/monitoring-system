import './style.scss'

const Input = ({ value, ...rest }) => {
  return <input type="text" className="home-input" autoComplete="off" value={value} {...rest} />
}

export default Input

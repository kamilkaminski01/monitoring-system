import './style.scss'
import classNames from 'classnames'

const Input = ({ value, className, ...rest }) => {
  return (
    <input
      type="text"
      className={classNames('input', className)}
      autoComplete="off"
      value={value}
      {...rest}
    />
  )
}

export default Input

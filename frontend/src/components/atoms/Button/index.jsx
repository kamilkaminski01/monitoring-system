import './style.scss'
import classNames from 'classnames'

const Button = ({ children, value, className, disable = false, onClick }) => {
  return (
    <button className={classNames('btn', className)} disabled={disable} onClick={onClick}>
      {children || value || 'Button'}
    </button>
  )
}

export default Button

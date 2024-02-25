import './style.scss'
import classNames from 'classnames'

const Button = ({ children, className, disable = false, onClick }) => {
  return (
    <button className={classNames('btn', className)} disabled={disable} onClick={onClick}>
      {children || 'Button'}
    </button>
  )
}

export default Button

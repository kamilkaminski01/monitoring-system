import './style.scss'
import classNames from 'classnames'

const GameLayout = ({ children, className }) => {
  return <div className={classNames(className)}>{children}</div>
}

export default GameLayout

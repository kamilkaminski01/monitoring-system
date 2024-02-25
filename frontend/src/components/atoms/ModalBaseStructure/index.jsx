import { useModals } from 'providers/modals/context'
import './style.scss'
import classNames from 'classnames'

const ModalBaseStructure = ({ children, className }) => {
  const { closeModal } = useModals()

  return (
    <div className={classNames('modal-base-structure', className)}>
      <div className="modal-base-structure__bg" onClick={closeModal} />
      {children}
    </div>
  )
}

export default ModalBaseStructure

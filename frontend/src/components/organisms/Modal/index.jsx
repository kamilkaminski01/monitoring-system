import Button from 'components/atoms/Button'
import ModalBaseStructure from 'components/atoms/ModalBaseStructure'
import './style.scss'
import { useModals } from 'providers/modals/context'

const Modal = ({ children, className, title, buttonText, onSubmit }) => {
  const { closeModal } = useModals()

  return (
    <ModalBaseStructure className={className}>
      <div className="modal animation--fade-in">
        <div className="modal__header">
          <span className="modal__close-btn" onClick={closeModal}>
            &times;
          </span>
          <h2 className="modal__title">{title}</h2>
        </div>
        <div className="modal__body">{children}</div>
        <div className="modal__footer">
          <Button className="modal__btn" type="submit" onClick={onSubmit}>
            {buttonText}
          </Button>
        </div>
      </div>
    </ModalBaseStructure>
  )
}

export default Modal

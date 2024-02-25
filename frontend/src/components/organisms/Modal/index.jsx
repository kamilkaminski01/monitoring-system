import Button from 'components/atoms/Button'
import ModalBaseStructure from 'components/atoms/ModalBaseStructure'
import './style.scss'

const Modal = ({ children, className, title, buttonText, onSubmit }) => {
  return (
    <ModalBaseStructure className={className}>
      <div className="modal">
        <div className="modal__header">
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

import { Fragment, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ModalsContext } from './context'

const ModalsProvider = ({ children }) => {
  const location = useLocation()

  const [modals, setModals] = useState([])

  const getScrollbarWidth = () => {
    return window.innerWidth - document.documentElement.clientWidth
  }

  const openModal = (modal) => {
    setModals((prevValue) => [...prevValue, modal])
  }

  const closeModal = () => {
    setModals((prevValue) => [...prevValue.slice(0, prevValue.length - 1)])
  }

  useEffect(() => {
    if (modals.length > 0) {
      const scrollbarWidth = getScrollbarWidth()
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = 'auto'
      document.body.style.paddingRight = '0'
    }
  }, [modals.length])

  useEffect(() => {
    setModals([])
  }, [location])

  return (
    <ModalsContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modals.map((modal, index) => (
        <Fragment key={index}>{modal}</Fragment>
      ))}
    </ModalsContext.Provider>
  )
}

export default ModalsProvider

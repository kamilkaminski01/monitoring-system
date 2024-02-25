import { createContext, useContext } from 'react'

export const ModalsContext = createContext({})

export const useModals = () => useContext(ModalsContext)

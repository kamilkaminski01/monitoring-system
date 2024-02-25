import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AuthContextProvider from 'providers/auth'
import UsernameContextProvider from 'providers/username'
import ModalsProvider from 'providers/modals'
import App from './App'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <UsernameContextProvider>
          <ModalsProvider>
            <App />
          </ModalsProvider>
        </UsernameContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
)

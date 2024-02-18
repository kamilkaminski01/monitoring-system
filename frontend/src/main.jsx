import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AuthContextProvider from 'providers/auth'
import UsernameContextProvider from 'providers/username'
import App from './App.jsx'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <UsernameContextProvider>
          <App />
        </UsernameContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
)

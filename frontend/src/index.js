import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from 'providers/AuthContextProvider';
import { UsernameContextProvider } from 'providers/UsernameContextProvider';
import App from './App';
import 'index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <UsernameContextProvider>
          <App />
        </UsernameContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

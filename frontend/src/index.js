import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

//Provider Routers
import { BrowserRouter } from 'react-router-dom';
//Provider Context Modal
import { ModalProvider } from './context/ModalContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ModalProvider>
        <App />
      </ModalProvider>
    </BrowserRouter>
  </React.StrictMode>
);

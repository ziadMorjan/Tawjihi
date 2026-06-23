import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n'; // ← must be imported before App renders
import { AppProviders } from './providers/providers';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
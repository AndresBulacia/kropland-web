import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import { initOfflineDetection, startAutoSync, registerServiceWorker } from './lib/offline';

registerServiceWorker();
initOfflineDetection();
startAutoSync();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
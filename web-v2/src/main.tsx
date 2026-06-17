import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initAuthListener } from './store/authStore';

// Apply dark mode on initial load
const saved = localStorage.getItem('lifelink-auth');
if (saved) {
  const parsed = JSON.parse(saved);
  if (parsed?.state?.darkMode) document.documentElement.classList.add('dark');
}

initAuthListener();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

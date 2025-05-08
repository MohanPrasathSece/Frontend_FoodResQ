import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';

// Configure axios baseURL per environment
if (process.env.NODE_ENV === 'development') {
  // Use CRA proxy in development
  axios.defaults.baseURL = '';
} else {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL || '';
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
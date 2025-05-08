import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';

// Configure axios baseURL: prioritize REACT_APP_API_URL, else use CRA proxy in dev, else fallback to Railway
const envApiUrl = process.env.REACT_APP_API_URL;
if (envApiUrl) {
  axios.defaults.baseURL = envApiUrl;
} else if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = '';
} else {
  axios.defaults.baseURL = 'https://backendfoodresq-production.up.railway.app';
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
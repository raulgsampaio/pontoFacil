import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from './Login';
import Painel from './Painel';
import './index.css';

const path = window.location.pathname;

const App = () => {
  if (path === '/painel') return <Painel />;
  return <Login />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

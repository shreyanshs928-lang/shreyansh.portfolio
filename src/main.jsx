import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Layout from './components/Layout.jsx';
import './styles/index.css';
import './styles/animations.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Layout>
      <App />
    </Layout>
  </React.StrictMode>
);

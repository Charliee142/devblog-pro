/**
 * main.jsx - React Application Entry Point
 *
 * TEACHING NOTE:
 * This is where React "mounts" (attaches) our app to the HTML page.
 * document.getElementById('root') finds the <div id="root"> in index.html.
 * ReactDOM.createRoot creates a React root and renders our App component inside it.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// Import Bootstrap CSS (from node_modules)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
// Import react-toastify CSS
import 'react-toastify/dist/ReactToastify.css';
// Import our custom global styles
import './assets/styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*
      TEACHING NOTE: BrowserRouter
      Wraps our entire app so React Router can manage navigation.
      It listens to the browser's URL and renders matching components.
    */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

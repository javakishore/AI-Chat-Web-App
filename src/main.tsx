import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * Main entry point for the DaivAI React application
 * Renders the root App component into the DOM
 *
 * Uses React 18's createRoot API for concurrent features
 * StrictMode is enabled for development to detect potential issues
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

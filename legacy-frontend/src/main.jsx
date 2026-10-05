/**
 * @file Punto de entrada de Vite: monta la aplicación React en `#root`
 * (definido en index.html) y carga los estilos globales.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

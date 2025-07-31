// File: src/index.js

/* ───────────── IMPORTS (phải ở đầu file) ───────────── */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';

import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import App from './App';

/* ───────────── KHỞI TẠO THƯ VIỆN SAU IMPORT ───────────── */
import AOS from 'aos';
AOS.init({ once: true, duration: 600 });

/* ───────────── RENDER APP ───────────── */
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  </BrowserRouter>
);

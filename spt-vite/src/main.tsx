import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import ScrollToTop from './components/ScrollToTop'; 
import { HelmetProvider } from 'react-helmet-async'; 
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import { GoogleAuthProvider } from './context/GoogleAuthContext'; 

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop /> 
      <LanguageProvider>
        <HelmetProvider>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleAuthProvider>
              <App />
            </GoogleAuthProvider>
          </GoogleOAuthProvider>
        </HelmetProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { AppShell } from './app/AppShell';
import { AuthProvider } from './auth/AuthProvider';
import './styles.css';

createRoot(document.getElementById('root')!).render(<React.StrictMode><AuthProvider><HashRouter><AppShell /></HashRouter></AuthProvider></React.StrictMode>);

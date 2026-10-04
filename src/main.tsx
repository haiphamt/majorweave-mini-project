import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { AppShell } from './app/AppShell';
import './styles.css';

createRoot(document.getElementById('root')!).render(<React.StrictMode><HashRouter><AppShell /></HashRouter></React.StrictMode>);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import Prototype from './Prototype';

createRoot(document.getElementById('root')!).render(
  <StrictMode><HashRouter><Prototype/></HashRouter></StrictMode>,
);

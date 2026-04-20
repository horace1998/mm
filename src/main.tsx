import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { SYNKProvider } from "./lib/Store";
import { FandomProvider } from "./lib/FandomContext";
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SYNKProvider>
      <FandomProvider>
        <App />
      </FandomProvider>
    </SYNKProvider>
  </StrictMode>,
);

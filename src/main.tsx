import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* حذف basename چون دامین اختصاصی مستقیماً به روت اشاره می‌کند */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* اضافه کردن basename برای حل مشکل صفحه سفید در گیت‌هاب */}
    <BrowserRouter basename="/demandio.cloud">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
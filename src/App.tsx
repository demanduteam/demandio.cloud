/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import News from './pages/News';
import Article from './pages/Article';
import Tools from './pages/Tools';
import Admin from './pages/Admin';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Navbar from './components/Navbar';

export default function App() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('demandio_lang') || 'nl';
  });

  const handleSetLang = (newLang: string) => {
    localStorage.setItem('demandio_lang', newLang);
    setLang(newLang);
  };

  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.substring(1);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  return (
    <>
      {!isAdminPath && <Navbar lang={lang} setLang={handleSetLang} />}
      <div className={!isAdminPath ? 'pt-16' : ''}>
        <Routes>
          <Route path="/" element={<Home lang={lang} setLang={handleSetLang} />} />
          <Route path="/news" element={<News lang={lang} setLang={handleSetLang} />} />
          <Route path="/article" element={<Article lang={lang} setLang={handleSetLang} />} />
          <Route path="/tools" element={<Tools lang={lang} setLang={handleSetLang} />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </div>
    </>
  );
}


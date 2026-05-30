import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, Globe, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar({ lang, setLang }: { lang: string, setLang: (l: string) => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  const content: any = {
      en: { nav: { solutions: "Solutions", pillars: "Ecosystem", news: "News", contact: "Contact", tools: "Tools" } },
      nl: { nav: { solutions: "Oplossingen", pillars: "Ecosysteem", news: "Nieuws", contact: "Contact", tools: "Hulpmiddelen" } }
  };
  const t = content[lang];

  const handleNavClick = (hash: string) => {
    setMobileMenuOpen(false);
    if (isHome) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#' + hash);
    }
  };

  const handleLogoClick = () => {
    if (isHome) {
      document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
            <div className="flex items-center cursor-pointer" onClick={() => handleLogoClick()}>
            <span className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                <Car className="text-white w-6 h-6" />
                </div>
                Demandio
            </span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => handleNavClick('roles')} className="text-gray-600 hover:text-blue-600 font-medium">{t.nav.solutions}</button>
            <button onClick={() => handleNavClick('pillars')} className="text-gray-600 hover:text-blue-600 font-medium">{t.nav.pillars}</button>
            <Link to="/news" className="text-gray-600 hover:text-blue-600 font-medium">{t.nav.news}</Link>
            <Link to="/tools" className="text-gray-600 hover:text-blue-600 font-medium">{t.nav.tools}</Link>
            <button 
                onClick={() => setLang(lang === 'en' ? 'nl' : 'en')}
                className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
            >
                <Globe className="w-4 h-4" />
                {lang === 'en' ? 'NL' : 'EN'}
            </button>
            <button onClick={() => handleNavClick('contact')} className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition font-medium">
                {t.nav.contact}
            </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
                <button 
                onClick={() => setLang(lang === 'en' ? 'nl' : 'en')}
                className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs font-bold text-gray-700"
            >
                {lang.toUpperCase()}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X /> : <Menu />}
            </button>
            </div>
        </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4">
            <button onClick={() => handleNavClick('roles')} className="block w-full text-left text-gray-600 font-medium">{t.nav.solutions}</button>
            <button onClick={() => handleNavClick('pillars')} className="block w-full text-left text-gray-600 font-medium">{t.nav.pillars}</button>
            <Link to="/news" className="block text-gray-600 font-medium" onClick={()=>setMobileMenuOpen(false)}>{t.nav.news}</Link>
            <Link to="/tools" className="block text-gray-600 font-medium" onClick={()=>setMobileMenuOpen(false)}>{t.nav.tools}</Link>
            <button onClick={() => handleNavClick('contact')} className="block text-blue-600 font-bold">{t.nav.contact}</button>
        </div>
        )}
    </nav>
  );
}

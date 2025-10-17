import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Logo from './Logo';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { id: 'home', label: t('home') },
    { id: 'about', label: t('about') },
    { id: 'services', label: t('services') },
    { id: 'projects', label: t('projects') },
    { id: 'team', label: t('team') },
    { id: 'contact', label: t('contact') },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="focus:outline-none">
            <Logo
              textColor="#ffffff"
              iconColor="#a855f7"
              showTagline={true}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-white hover:text-purple-400 transition-colors duration-200 font-medium"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <button
                onClick={() => setShowLoginMenu(!showLoginMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors duration-200"
              >
                <LogIn size={18} />
                <span className="text-sm font-medium">
                  {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                </span>
              </button>

              {showLoginMenu && (
                <div className="absolute top-full mt-2 end-0 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden min-w-[200px] z-50">
                  <Link
                    to="/employee/login"
                    className="block px-4 py-3 text-white hover:bg-gray-700 transition-colors"
                    onClick={() => setShowLoginMenu(false)}
                  >
                    {language === 'ar' ? 'دخول الموظفين' : 'Employee Login'}
                  </Link>
                  <Link
                    to="/client/login"
                    className="block px-4 py-3 text-white hover:bg-gray-700 transition-colors"
                    onClick={() => setShowLoginMenu(false)}
                  >
                    {language === 'ar' ? 'دخول العملاء' : 'Client Login'}
                  </Link>
                  <Link
                    to="/admin/login"
                    className="block px-4 py-3 text-white hover:bg-gray-700 transition-colors border-t border-gray-700"
                    onClick={() => setShowLoginMenu(false)}
                  >
                    {language === 'ar' ? 'دخول الإدارة' : 'Admin Login'}
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M3 10h18" />
                <path d="M3 14h6" />
                <path d="M3 18h6" />
              </svg>
              <span className="text-sm font-medium">{language === 'ar' ? 'EN' : 'العربية'}</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-fadeIn">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-white hover:text-purple-400 transition-colors duration-200 py-2 text-start font-medium"
                >
                  {link.label}
                </button>
              ))}
              <div className="border-t border-gray-700 mt-2 pt-2">
                <Link
                  to="/employee/login"
                  className="block text-white hover:text-purple-400 transition-colors duration-200 py-2 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {language === 'ar' ? 'دخول الموظفين' : 'Employee Login'}
                </Link>
                <Link
                  to="/client/login"
                  className="block text-white hover:text-purple-400 transition-colors duration-200 py-2 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {language === 'ar' ? 'دخول العملاء' : 'Client Login'}
                </Link>
                <Link
                  to="/admin/login"
                  className="block text-white hover:text-purple-400 transition-colors duration-200 py-2 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {language === 'ar' ? 'دخول الإدارة' : 'Admin Login'}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

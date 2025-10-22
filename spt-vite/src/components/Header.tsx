import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import 'flag-icons/css/flag-icons.min.css';
import { HeaderProps } from '../lib/types';
import LoginModal from './LoginModal'; 
import ProfileModal from './ProfileModal'; 

const Header: React.FC<HeaderProps> = ({ mobileMenuOpen, toggleMobileMenu }) => {
  const { language, setLanguage, t } = useLanguage();
  const { isLoggedIn, user } = useGoogleAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isAuthUIVisible, setIsAuthUIVisible] = useState(false); 

  const logoUrl = "/spt_logo.png"

  const navLinks = [
    { name: t('home'), href: `/${language}` },
    { name: t('topPackages'), href: `/${language}#packages` },
    { name: t('about'), href: `/${language}#about` },
    { name: t('gallery'), href: `/${language}#gallery` },
    { name: t('faq'), href: `/${language}#faq` },
    { name: t('contact'), href: `/${language}#contact` },
    { name: t('blog'), href: `/${language}/blogs` },
    { name: t('intlTour'), href: `/${language}/international-tours` },
    { name: t('domesticTour'), href: `/${language}/domestic-tours` },
    { name: t('admin'), href: '/admin' },
  ];

  const toggleLanguage = () => {
    const next = language === 'id' ? 'en' : language === 'en' ? 'ru' : 'id';
    setLanguage(next); 
  };

  const toggleAuthUI = useCallback(() => {
    setIsAuthUIVisible(prev => !prev);
  }, []);

  const closeAuthUI = useCallback(() => {
    setIsAuthUIVisible(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      setIsAuthUIVisible(false);
    }
  }, [mobileMenuOpen]);

  const flagCode = language === 'id' ? 'id' : language === 'en' ? 'us' : 'ru';
  const nextLangLabel = language === 'id' ? 'English' : language === 'en' ? 'Русский' : 'Bahasa Indonesia';

  const iconColorClass = scrolled || mobileMenuOpen ? 'text-gray-700 hover:text-[#FB8C00]' : 'text-white hover:text-[#FB8C00]';
  const textColorClass = scrolled || mobileMenuOpen ? 'text-black' : 'text-white';

  const renderProfileIcon = (size: number) => (
    user?.picture ? (
      <img 
        src={user.picture} 
        alt={t('profile')} 
        className={`h-${size} w-${size} rounded-full object-cover border-2 border-transparent transition-all duration-200 ${
          scrolled ? 'border-[#FB8C00]' : 'border-white'
        }`} 
      />
    ) : (
      <User size={24} className={iconColorClass} />
    )
  );

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-4">
        <div className="flex justify-between items-center lg:space-x-4">
          <div className="flex justify-start">
            <a href={`/${language}`} aria-label="Simbolon Phuket Tour Homepage"> 
              <img
                src={logoUrl}
                alt={t('heroTitle')}
                className="h-16 w-auto"
                loading="eager"
                decoding="async"
              />
            </a>
          </div>

          <div className="flex items-center mr-2 lg:hidden">
            <button
              onClick={toggleAuthUI}
              className={`p-2 mr-2 rounded-full transition-colors ${iconColorClass}`}
              aria-label={isLoggedIn ? t('profile') : t('customerLoginTitle')}
              aria-expanded={isAuthUIVisible}
            >
              {renderProfileIcon(6)}
            </button>

            <button
              onClick={toggleLanguage}
              className={`flex items-center p-2 mr-2 rounded-md transition-colors ${
                scrolled || mobileMenuOpen ? 'hover:bg-gray-100' : 'hover:bg-gray-700'
              }`}
              aria-label={`Switch to ${nextLangLabel}`}
            >
              <span className={`fi fi-${flagCode} h-5 w-5 mr-[5px]`} />
              <span className={`ml-1 text-sm font-medium ${textColorClass}`}>{language.toUpperCase()}</span>
            </button>
            <button
              onClick={toggleMobileMenu}
              className={`p-2 rounded-md transition-colors ${
                scrolled || mobileMenuOpen
                  ? 'text-gray-700 hover:text-[#102D5E]'
                  : 'text-white hover:text-blue-200'
              }`}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <nav className="hidden lg:flex space-x-8" role="navigation" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  scrolled
                    ? 'text-gray-700 hover:text-[#102D5E]'
                    : 'text-white hover:text-blue-200'
                }`}
                aria-label={`Navigate to ${link.name} section`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4 relative">
            <button
              onClick={toggleAuthUI}
              className={`p-2 rounded-full transition-colors ${
                scrolled
                  ? 'hover:bg-gray-100'
                  : 'hover:bg-gray-700'
              } ${isAuthUIVisible ? 'ring-2 ring-[#FB8C00] ring-offset-2 ring-offset-transparent' : ''}`}
              aria-label={isLoggedIn ? t('profile') : t('customerLoginTitle')}
              aria-expanded={isAuthUIVisible}
              id="user-menu-button"
            >
              {renderProfileIcon(8)}
            </button>

            <button
              onClick={toggleLanguage}
              className={`flex items-center p-2 rounded-md transition-colors ${
                scrolled ? 'hover:bg-gray-100' : 'hover:bg-gray-700'
              }`}
              aria-label={`Switch to ${nextLangLabel}`}
            >
              <span className={`fi fi-${flagCode} h-6 w-6 mr-[5px]`} />
              <span className={`ml-1 text-sm font-medium ${textColorClass}`}>{language.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>

      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:hidden bg-white shadow-lg`}>
        <nav className="pt-2 pb-4 space-y-1 px-4" role="navigation" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-2 text-base font-medium text-gray-700 hover:text-[#102D5E]"
              onClick={toggleMobileMenu}
              aria-label={`Navigate to ${link.name} section`}
            >
              {link.name}
            </a>
          ))}
        </nav>
      </div>

      {!isLoggedIn && <LoginModal isOpen={isAuthUIVisible} onClose={closeAuthUI} />}
      
      {isLoggedIn && <ProfileModal isOpen={isAuthUIVisible} onClose={closeAuthUI} />}
    </header>
  );
};

export default Header;

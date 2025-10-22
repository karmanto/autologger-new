import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom'; 
import { useLanguage } from '../context/LanguageContext';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import { User } from 'lucide-react';
import 'flag-icons/css/flag-icons.min.css';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import LoginModal from '../components/LoginModal'; 
import ProfileModal from '../components/ProfileModal'; 

const BlogLayout: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isLoggedIn, user } = useGoogleAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAuthUIVisible, setIsAuthUIVisible] = useState(false); 

  const toggleAuthUI = useCallback(() => {
    setIsAuthUIVisible(prev => !prev);
  }, []);

  const closeAuthUI = useCallback(() => {
    setIsAuthUIVisible(false);
  }, []);

  const toggleLanguage = () => {
    const next = language === 'id' ? 'en' : language === 'en' ? 'ru' : 'id';
    setLanguage(next);
  };

  const flagCode = language === 'id' ? 'id' : language === 'en' ? 'us' : 'ru';
  const nextLangLabel = language === 'id' ? 'English' : language === 'en' ? 'Русский' : 'Bahasa Indonesia';
  const logoUrl = "/spt_logo.png"

  const renderProfileIcon = (size: number) => (
    user?.picture ? (
      <img 
        src={user.picture} 
        alt={t('profile')} 
        className={`h-${size} w-${size} rounded-full object-cover border-2 border-[#FB8C00] transition-all duration-200`} 
      />
    ) : (
      <User size={24} className="text-gray-700 hover:text-[#FB8C00]" />
    )
  );

  return (
    <div className="min-h-screen text-text">
      <header className="bg-white shadow-md px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
          <div className="flex justify-start">
            <a href="/" aria-label="Simbolon Phuket Tour Homepage">
              <img
                src={logoUrl}
                alt={t('home')}
                className="h-16 w-auto"
                loading="eager"
                decoding="async"
              />
            </a>
          </div>
          <div className="flex items-center space-x-4">
            {/* Profile Button */}
            <button
              onClick={toggleAuthUI}
              className={`p-2 rounded-full transition-colors hover:bg-gray-100 ${isAuthUIVisible ? 'ring-2 ring-[#FB8C00] ring-offset-2 ring-offset-white' : ''}`}
              aria-label={isLoggedIn ? t('profile') : t('customerLoginTitle')}
              aria-expanded={isAuthUIVisible}
              id="user-menu-button-blog"
            >
              {renderProfileIcon(8)}
            </button>
            
            {/* Language Button */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center p-2 rounded-md transition-colors hover:bg-gray-100`}
              aria-label={`Switch to ${nextLangLabel}`}
            >
              <span className={`fi fi-${flagCode} h-5 w-5 mr-[5px]`} />
              <span className={`ml-1 text-sm font-medium text-black`}>{language.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </header>
      <Outlet context={{ searchTerm, selectedCategory, setSearchTerm, setSelectedCategory }} /> 
      <Footer />
      <WhatsAppButton />

      {/* Modals */}
      {!isLoggedIn && <LoginModal isOpen={isAuthUIVisible} onClose={closeAuthUI} />}
      {isLoggedIn && <ProfileModal isOpen={isAuthUIVisible} onClose={closeAuthUI} />}
    </div>
  );
};

export default BlogLayout;

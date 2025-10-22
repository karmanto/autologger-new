import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Gift, Globe, Menu, X, Settings, BookOpen } from 'lucide-react'; 

const AdminLayout: React.FC = () => {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const logoUrl = '/spt_logo.png';

  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <div className="min-h-screen text-text bg-gray-100">
      <header className="bg-white shadow-md px-4 sm:px-6 lg:px-8 sticky top-0 z-50 flex items-center justify-between h-16">
        <div className="flex items-center">
          <a href="/" aria-label="Simbolon Phuket Tour Homepage">
            <img
              src={logoUrl}
              alt={t('home')}
              className="h-12 w-auto"
              loading="eager"
              decoding="async"
            />
          </a>
        </div>
        <button
          className="sm:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X className="h-6 w-6 text-textSecondary" /> : <Menu className="h-6 w-6 text-textSecondary" />}
        </button>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={toggleMenu} 
          aria-hidden="true"
        ></div>
      )}

      <nav className={
        `fixed inset-y-0 left-0 w-64 bg-surface shadow-lg z-40 transform transition-transform duration-300 ease-in-out ` +
        (menuOpen ? 'translate-x-0' : '-translate-x-full') +
        ' sm:relative sm:translate-x-0 sm:block sm:w-auto sm:h-auto sm:bg-transparent sm:shadow-none sm:py-0 sm:px-0'
      }>
        <div className="p-4 flex items-center justify-between border-b border-border sm:hidden">
          <a href="/" aria-label="Simbolon Phuket Tour Homepage">
            <img
              src={logoUrl}
              alt={t('home')}
              className="h-10 w-auto" 
              loading="eager"
              decoding="async"
            />
          </a>
          <button
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={toggleMenu}
            aria-label="Close navigation menu"
          >
            <X className="h-6 w-6 text-textSecondary" />
          </button>
        </div>

        <div className="flex flex-col p-4 sm:flex-row sm:flex-wrap sm:gap-2 sm:gap-4 sm:text-sm sm:font-medium sm:p-0 sm:max-w-7xl sm:mx-auto">
          <Link
            to="/admin"
            className="flex items-center px-3 py-2 rounded-md text-textSecondary hover:bg-gray-700 hover:text-white transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            dashboard
          </Link>
          <Link
            to="/admin/promos"
            className="flex items-center px-3 py-2 rounded-md text-textSecondary hover:bg-gray-700 hover:text-white transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            <Gift className="h-4 w-4 mr-2" />
            kelola promo
          </Link>
          <Link
            to="/admin/tours"
            className="flex items-center px-3 py-2 rounded-md text-textSecondary hover:bg-gray-700 hover:text-white transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            <Globe className=" h-4 w-4 mr-2" />
            kelola paket tur
          </Link>
          <Link
            to="/admin/international-tours"
            className="flex items-center px-3 py-2 rounded-md text-textSecondary hover:bg-gray-700 hover:text-white transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            <Globe className=" h-4 w-4 mr-2" />
            kelola paket tur internasional
          </Link>
          <Link
            to="/admin/domestic-tours"
            className="flex items-center px-3 py-2 rounded-md text-textSecondary hover:bg-gray-700 hover:text-white transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            <Globe className=" h-4 w-4 mr-2" />
            kelola paket tur domestic
          </Link>
          <Link
            to="/admin/blogs"
            className="flex items-center px-3 py-2 rounded-md text-textSecondary hover:bg-gray-700 hover:text-white transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            <BookOpen className=" h-4 w-4 mr-2" />
            kelola blog
          </Link>
          <Link
            to="/admin/seo-settings"
            className="flex items-center px-3 py-2 rounded-md text-textSecondary hover:bg-gray-700 hover:text-white transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            <Settings className="h-4 w-4 mr-2" />
            kelola SEO
          </Link>
        </div>
      </nav>

      <Outlet />
    </div>
  );
};

export default AdminLayout;

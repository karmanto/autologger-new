import { useGoogleAuth } from '../context/GoogleAuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogOut, Mail, Globe, X } from 'lucide-react';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileDropdown({ isOpen, onClose }: ProfileDropdownProps) {
  const { user, isLoggedIn, logout } = useGoogleAuth();
  const { t, language } = useLanguage();

  if (!isOpen || !isLoggedIn || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div 
      className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 p-4 transform transition duration-200 ease-out"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu-button"
    >
      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">{t('profileTitle')}</h3>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-gray-700 transition p-1"
          aria-label={t('close')}
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center py-4">
        <img
          src={user.picture}
          alt={user.name}
          className="h-16 w-16 rounded-full object-cover border-2 border-[#FB8C00] shadow-md"
        />
        <p className="mt-3 text-base font-bold text-gray-900 truncate max-w-full px-2">
          {user.name}
        </p>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
          <Mail className="h-4 w-4 text-[#102D5E]" />
          <span className="text-gray-700 font-medium">{t('email')}:</span>
          <span className="text-gray-900 flex-1 text-right truncate">{user.email}</span>
        </div>
        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
          <Globe className="h-4 w-4 text-[#102D5E]" />
          <span className="text-gray-700 font-medium">{t('language')}:</span>
          <span className="text-gray-900 flex-1 text-right">{language.toUpperCase()}</span>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-4 w-full flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition duration-150 shadow-md"
        role="menuitem"
      >
        <LogOut className="h-4 w-4 mr-2" />
        {t('logout')}
      </button>
    </div>
  );
}

import { useGoogleAuth } from '../context/GoogleAuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogOut, Mail, Globe, X, UserCircle } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
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
      className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-title"
    >
      <div 
        className="bg-white rounded-xl shadow-3xl p-8 w-full max-w-sm transform transition duration-300 scale-100"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-end">
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-700 transition p-1"
            aria-label={t('close')}
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-4 mt-[-10px]">
          <UserCircle className="h-10 w-10 text-[#FB8C00]" />
          <h2 id="profile-title" className="text-2xl font-bold text-gray-900 text-center">
            {t('profileTitle')}
          </h2>
        </div>

        <div className="flex flex-col items-center py-4 border-b border-gray-100 mb-4">
          <img
            src={user.picture}
            alt={user.name}
            className="h-16 w-16 rounded-full object-cover border-2 border-[#FB8C00] shadow-md"
          />
          <p className="mt-3 text-base font-bold text-gray-900 truncate max-w-full px-2">
            {user.name}
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <Mail className="h-4 w-4 text-[#102D5E]" />
            <span className="text-gray-700 font-medium">{t('email')}:</span>
            <span className="text-gray-900 flex-1 text-right truncate">{user.email}</span>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <Globe className="h-4 w-4 text-[#102D5E]" />
            <span className="text-gray-700 font-medium">{t('language')}:</span>
            <span className="text-gray-900 flex-1 text-right">{language.toUpperCase()}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full flex items-center justify-center py-3 px-3 rounded-lg text-base font-medium text-white bg-red-600 hover:bg-red-700 transition duration-150 shadow-md"
          role="menuitem"
        >
          <LogOut className="h-5 w-5 mr-2" />
          {t('logout')}
        </button>
      </div>
    </div>
  );
}

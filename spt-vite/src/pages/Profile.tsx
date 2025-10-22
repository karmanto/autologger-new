import { useEffect } from 'react';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Mail, Globe } from 'lucide-react';

export default function Profile() {
  const { user, isLoggedIn, logout } = useGoogleAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(`/${language}/customer-login`, { replace: true });
    }
  }, [isLoggedIn, navigate, language]);

  if (!isLoggedIn || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate(`/${language}`, { replace: true });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center pt-16">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-2xl p-10 transform transition duration-500">
        <div className="flex flex-col items-center space-y-6">
          <img
            src={user.picture}
            alt={user.name}
            className="h-24 w-24 rounded-full object-cover border-4 border-[#FB8C00] shadow-lg"
          />
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            {user.name}
          </h2>
          <p className="text-lg text-gray-600 font-medium">{t('profileTitle')}</p>
        </div>

        <div className="mt-8 space-y-4 border-t pt-6">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="h-5 w-5 text-[#102D5E]" />
            <span className="text-gray-700 font-medium">{t('email')}:</span>
            <span className="text-gray-900 flex-1 text-right truncate">{user.email}</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Globe className="h-5 w-5 text-[#102D5E]" />
            <span className="text-gray-700 font-medium">{t('language')}:</span>
            <span className="text-gray-900 flex-1 text-right">{language.toUpperCase()}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-red-600 hover:bg-red-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <LogOut className="h-5 w-5 mr-2" />
          {t('logout')}
        </button>
      </div>
    </div>
  );
}

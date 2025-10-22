import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogIn } from 'lucide-react';

export default function CustomerLogin() {
  const { handleCredentialResponse, isLoggedIn } = useGoogleAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(`/${language}/profile`, { replace: true });
    }
  }, [isLoggedIn, navigate, language]);

  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center pt-16">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 transform transition duration-500 hover:shadow-3xl">
        <div className="flex flex-col items-center space-y-4">
          <LogIn className="h-10 w-10 text-[#FB8C00]" />
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            {t('customerLoginTitle')}
          </h2>
          <p className="text-gray-600 text-center">
            {t('customerLoginSubtitle')}
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <GoogleLogin
            onSuccess={handleCredentialResponse}
            onError={() => {
              console.error('Google Login Failed');
            }}
            useOneTap={false}
            text='continue_with'
            shape='pill'
            theme='outline'
            size='large'
          />
        </div>
        <p className="mt-6 text-xs text-gray-500 text-center">
          {t('loginDisclaimer')}
        </p>
      </div>
    </div>
  );
}

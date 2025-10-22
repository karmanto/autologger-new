import { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogIn, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { handleCredentialResponse, isLoggedIn } = useGoogleAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (isLoggedIn && isOpen) {
      onClose();
    }
  }, [isLoggedIn, isOpen, onClose]);

  if (!isOpen || isLoggedIn) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
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
          <LogIn className="h-10 w-10 text-[#FB8C00]" />
          <h2 id="login-title" className="text-2xl font-bold text-gray-900 text-center">
            {t('customerLoginTitle')}
          </h2>
          <p className="text-sm text-gray-600 text-center">
            {t('customerLoginSubtitle')}
          </p>
        </div>

        <div className="mt-6 flex justify-center">
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
        <p className="mt-4 text-xs text-gray-500 text-center">
          {t('loginDisclaimer')}
        </p>
      </div>
    </div>
  );
}

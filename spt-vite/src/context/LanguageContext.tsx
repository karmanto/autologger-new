import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Language } from '../lib/types';

type TranslationKeys = { [key: string]: string };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  setLanguageFromUrl: (lang: Language) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

const getLanguageFromLocalStorage = (): Language | null => {
  const storedLang = localStorage.getItem('userLanguage');
  if (storedLang === 'id' || storedLang === 'en' || storedLang === 'ru') {
    return storedLang;
  }
  return null;
};

const saveLanguageToLocalStorage = (lang: Language) => {
  localStorage.setItem('userLanguage', lang);
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);
  const [currentTranslations, setCurrentTranslations] = useState<TranslationKeys>({});
  const [fallbackTranslations, setFallbackTranslations] = useState<TranslationKeys>({}); // Mengganti defaultTranslations

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    saveLanguageToLocalStorage(lang);

    const path = location.pathname;
    const pathSegments = path.split('/').filter(Boolean);
    const currentLangInUrl = pathSegments[0];

    let newPath = `/${lang}`;
    if (['id', 'en', 'ru'].includes(currentLangInUrl)) {
      newPath += `/${pathSegments.slice(1).join('/')}`;
    } else {
      newPath += path === '/' ? '' : path;
    }
    navigate(newPath);
  }, [navigate, location.pathname]);

  const setLanguageFromUrl = useCallback((lang: Language) => {
    setLanguageState(lang);
    saveLanguageToLocalStorage(lang);
  }, []);

  // Effect untuk menginisialisasi bahasa dari URL, localStorage, atau IP
  useEffect(() => {
    const path = location.pathname;
    const pathSegments = path.split('/').filter(Boolean);
    const langInUrl = pathSegments[0];

    const initializeLanguage = async () => {
      if (['id', 'en', 'ru'].includes(langInUrl)) {
        setLanguageState(langInUrl as Language);
        saveLanguageToLocalStorage(langInUrl as Language);
      } else {
        const storedLang = getLanguageFromLocalStorage();
        if (storedLang) {
          setLanguageState(storedLang);
        } else {
          try {
            const urlGetLanguageFromIp = 'https://get.geojs.io/v1/ip/country.json';
            const response = await fetch(urlGetLanguageFromIp);
            const data = await response.json();
            let detectedLang: Language = 'en';

            if (data.country) {
              const countryCode = data.country.toLowerCase();
              if (countryCode === 'id') {
                detectedLang = 'id';
              } else if (countryCode === 'ru') {
                detectedLang = 'ru';
              }
            }
            setLanguageState(detectedLang);
            saveLanguageToLocalStorage(detectedLang);
          } catch (error) {
            console.error('Failed to detect language from IP:', error);
            setLanguageState("en");
            saveLanguageToLocalStorage("en");
          }
        }
      }
      setIsLoading(false);
    };

    initializeLanguage();
  }, [location.pathname]);

  useEffect(() => {
    const loadFallbackTranslations = async () => {
      try {
        const module = await import(`../locales/en.json`); 
        setFallbackTranslations(module.default);
      } catch (error) {
        console.error('Failed to load fallback (en) translations:', error);
      }
    };
    loadFallbackTranslations();
  }, []); 

  useEffect(() => {
    const loadCurrentTranslations = async () => {
      if (!language) return; 

      try {
        const module = await import(`../locales/${language}.json`);
        setCurrentTranslations(module.default);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        setCurrentTranslations(fallbackTranslations);
      }
    };

    loadCurrentTranslations();
  }, [language, fallbackTranslations]); 

  const t = (key: string): string => {
    if (currentTranslations[key]) {
      return currentTranslations[key];
    }
    if (fallbackTranslations[key]) { 
      return fallbackTranslations[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, setLanguageFromUrl, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';
import advantagesData from '../data/advantages.json';
import { Advantage } from '../lib/types';

const getAdvantageIcon = (iconName: string) => {
  const iconClass = "w-8 h-8 text-primary";
  switch (iconName) {
    case 'document':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
        </svg>
      );
    case 'car':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
        </svg>
      );
    case 'refresh':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
      );
    case 'chat':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
        </svg>
      );
    case 'plus-circle':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      );
    case 'ticket':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
        </svg>
      );
    case 'currency':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      );
    case 'globe':
      return <Globe className={iconClass} />;
    default:
      return null;
  }
};

const Advantages: React.FC = () => {
  const { t, language } = useLanguage();

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const telegramUsername = import.meta.env.VITE_TELEGRAM_USERNAME;
  const whatsappMessage = encodeURIComponent(t('whatsappMessage'));

  const advantages: Advantage[] = advantagesData;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-aos="fade-up"
          >
            {t('advantagesTitle')}
          </h2>
          <div className="h-1 w-20 bg-primary mx-auto mb-8"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <div 
              key={advantage.id}
              className="text-center p-6 rounded-lg transition-all duration-300 hover:bg-blue-50"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100">
                {getAdvantageIcon(advantage.iconName)}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t(advantage.titleKey)}</h3>
              <p className="text-gray-600">{t(advantage.descriptionKey)}</p>
            </div>
          ))}
        </div>
        
        <div 
          className="mt-16 bg-primary rounded-lg p-8 text-center text-white"
          data-aos="fade-up"
        >
          <h3 className="text-4xl font-bold mb-3">
            {t('happyCustomers')}
          </h3>

          <h3 className="text-2xl font-medium mb-4">{t('stillConfused')}</h3>

          {language === 'ru' ? (
            <a
              href={`https://t.me/${telegramUsername}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-[#0088cc] hover:bg-[#006699] transition-colors duration-300"
              aria-label={t('contactAdminAria')}
            >
              {t('freeConsultation')}
            </a>
          ) : (
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-[#25d366] hover:bg-[#13a033] transition-colors duration-300"
              aria-label={t('contactAdminAria')}
            >
              {t('freeConsultation')}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default Advantages;

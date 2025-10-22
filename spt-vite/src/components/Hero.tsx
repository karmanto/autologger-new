import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import herosData from '../data/heros.json'; 
import { HeroSlide } from '../lib/types'; 
import { Link } from 'react-router-dom';

const slides: HeroSlide[] = herosData.heros;

const Hero: React.FC = () => {
  const { t, language } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const length = slides.length;

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const telegramUsername = import.meta.env.VITE_TELEGRAM_USERNAME;
  const whatsappMessage = encodeURIComponent(t('whatsappMessage'));

  const handleImageLoad = useCallback((imageUrl: string) => {
    setLoadedImages(prev => ({ ...prev, [imageUrl]: true }));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % length);
    }, 10000);
    return () => clearInterval(interval);
  }, [length]);

  useEffect(() => {
    const nextIndex = (current + 1) % length;
    const nextSlide = slides[nextIndex];

    if (nextSlide && !loadedImages[nextSlide.image]) {
      const img = new Image();
      img.src = nextSlide.image;
      img.onload = () => handleImageLoad(nextSlide.image);
      img.onerror = () => console.error(`Failed to load image: ${nextSlide.image}`);
    }
  }, [current, length, loadedImages, handleImageLoad]); 

  const slide: HeroSlide = slides[current]; 

  const title = useMemo(() => {
    return slide.heroTitle[language] || slide.heroTitle.en;
  }, [slide, language]);

  const subtitle = useMemo(() => {
    return slide.heroSubtitle[language] || slide.heroSubtitle.en;
  }, [slide, language]);

  return (
    <section
      id="home"
      className="relative bg-cover bg-center h-screen flex items-center transition-all duration-1000"
      aria-label={t('heroAria')}
      itemScope
      itemType="https://schema.org/WebPage"
    >
      {!loadedImages[slide.image] && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
      )}
    
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
          loadedImages[slide.image] ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: `url('${slide.image}')` }}
      >
        <img 
          src={`${slide.image}`} 
          alt="" 
          className="hidden" 
          onLoad={() => handleImageLoad(`${slide.image}`)} 
        />
      </div>
      
      <div className={`absolute inset-0 bg-black transition-opacity duration-1000 ${
        loadedImages[slide.image] ? 'opacity-50' : 'opacity-20'
      }`} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <h1
          className="text-4xl sm:text-3xl md:text-6xl text-center font-bold text-white leading-tight mb-4"
          data-aos="fade-up"
          itemProp="headline"
        >
          {title}
        </h1>
        <p
          className="text-xl sm:text-2xl text-white text-center mb-8"
          data-aos="fade-up"
          data-aos-delay="100"
          itemProp="description"
        >
          {subtitle}
        </p>
        <div
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <Link 
            to="/tours"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            aria-label={t('viewPackagesAria')}
          >
            {t('viewPackages')}
          </Link>
          {language === 'ru' ? (
            <a
              href={`https://t.me/${telegramUsername}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-[#0088cc] hover:bg-[#006699] transition-colors duration-300"
              aria-label={t('contactAdminAria')}
            >
              {t('contactAdmin')}
            </a>
          ) : (
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-[#25d366] hover:bg-[#13a033] transition-colors duration-300"
              aria-label={t('contactAdminAria')}
            >
              {t('contactAdmin')}
            </a>
          )}
        </div>
      </div>
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <a
          href="#promo"
          className="animate-bounce bg-white p-2 w-10 h-10 ring-1 ring-slate-200 rounded-full flex items-center justify-center"
          aria-label={t('scrollPromoAria')}
        >
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Hero;

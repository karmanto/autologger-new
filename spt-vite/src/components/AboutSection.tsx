import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  const fullDescription = t('aboutDescription');

  const textToBoldUppercase = [
    'Paket Wisata Phuket, Bangkok, Pattaya, dan destinasi populer lain di Thailand',
    'guide berbahasa Indonesia/English/Rusia',
    'itinerary custom GRATIS',
    'Land Tour Operator resmi & terpercaya',
    'approved by Thai Travel Agents Association',
    'PT. Simbolon Phuket Tour | NIB: 0703250032651',
    'tour packages to Phuket, Bangkok, Pattaya, and other popular destinations in Thailand',
    'Indonesian/English/Russian-speaking guides',
    'FREE customized itinerary',
    'licensed and reliable Land Tour Operators',
    'approved by the Thai Travel Agents Association',
    'турпакеты в Пхукет, Бангкок, Паттайю и другие популярные направления Таиланда',
    'гидов, говорящих на индонезийском, английском и русском языках',
    'бесплатное составление индивидуального маршрута',
    'официальными и надежными land tour операторами',
    'одобрены Ассоциацией туристических агентств Таиланда (TTAA)'
  ];

  let processedDescription = fullDescription;

  textToBoldUppercase.forEach(text => {
    const regex = new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'); 
    processedDescription = processedDescription.replace(
      regex,
      `<span class="font-bold">${text}</span>`
    );
  });

  processedDescription = processedDescription.replace(/\n\n/g, '<br /><br />');
  processedDescription = processedDescription.replace(/\n/g, '<br />');

  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center mb-6">
          <div
            className="mb-3"
            data-aos="fade-right"
          >
            <div className="w-full h-0 pb-[56.25%] relative">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/4FjNbNPUaB4"
                title={t('iframeTitle')}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                aria-label={t('iframeAriaLabel')}
              />
            </div>
          </div>
          <div data-aos="fade-right">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              {t('aboutTitle')}
            </h2>
            <div
              className="text-lg text-gray-600 mb-6"
              dangerouslySetInnerHTML={{ __html: processedDescription }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PromoCardProps } from '../lib/types';

const PromoCard: React.FC<PromoCardProps> = ({ promo, countdown }) => {
  const { t, language } = useLanguage();

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const telegramUsername = import.meta.env.VITE_TELEGRAM_USERNAME;

  const getTitle = () => {
    if (language === 'id') return promo.title_id;
    if (language === 'ru') return promo.title_ru || promo.title_en;
    return promo.title_en;
  };

  const getDescription = () => {
    if (language === 'id') return promo.description_id;
    if (language === 'ru') return promo.description_ru || promo.description_en;
    return promo.description_en;
  };

  const title = getTitle();
  const description = getDescription();

  const rawMessage = (() => {
    switch (language) {
      case 'id':
        return `Saya ingin memesan promo berikut:\n\nNama Promo: ${title}\nHarga: ${promo.price}`;
      case 'ru':
        return `Я хочу забронировать следующий промо-тур:\n\nНазвание: ${title}\nЦена: ${promo.price}`;
      default:
        return `I want to book the following promo:\n\nPromo Name: ${title}\nPrice: ${promo.price}`;
    }
  })();

  const encodedMessage = encodeURIComponent(rawMessage);
  const whatsappLink = (() => {
    switch (language) {
      case 'ru':
        return `https://t.me/${telegramUsername}?text=${encodedMessage}`;
      default:
        return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    }
  })();

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group cursor-pointer">
      <div className="relative h-64 overflow-hidden">
        <img
          src={`${import.meta.env.VITE_BASE_URL}/storage/${promo.image}`}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {countdown && (
        <div className="mb-2">
          <div className="text-center">
            <div className="bg-orange-500 p-1 w-full inline-block"> 
              <span className="text-lg font-bold mr-1 text-white">{countdown.days}</span>
              <span className="text-xs text-white">{t('dayRemaining')}</span>
            </div>
          </div>
        </div>
      )}

      <div className="px-6"> 

        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2"> 
          {description}
        </p>

        <div className="flex-col items-center justify-between mb-4"> 
          <table className="w-full text-left mb-4">
  <thead>
    <tr className="border-b">
      <th className="py-2 text-sm text-gray-500">{t('startFrom')}</th>
      <th className="py-2 text-sm text-gray-500"></th>
    </tr>
  </thead>
  <tbody>
    <tr className="hover:bg-gray-50">
      <td className="py-3">
        <div className="text-2xl font-bold text-gray-900">{promo.price}</div>
        {promo.old_price && (
          <div className="text-md text-gray-400 line-through decoration-red-500 decoration-2">
            {promo.old_price}
          </div>
        )}
      </td>
      <td className="py-3">
        {promo.price2 ? (
          <>
            <div className="text-2xl font-bold text-gray-900">{promo.price2}</div>
            {promo.old_price2 && (
              <div className="text-md text-gray-400 line-through decoration-red-500 decoration-2">
                {promo.old_price2}
              </div>
            )}
          </>
        ) : (
          ""
        )}
      </td>
    </tr>
  </tbody>
</table>


          
          <div className={`flex gap-2`}> 
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold text-base hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 group/btn whitespace-nowrap" 
              aria-label={t('bookNow')}
            >
              {t('bookNow')}
            </a>

            <a
              href={promo.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-800 px-6 py-2 rounded-xl font-medium text-base border-2 border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2 group/btn whitespace-nowrap"
              aria-label={t('viewDetail')}
            >
              {t('viewDetail')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoCard;

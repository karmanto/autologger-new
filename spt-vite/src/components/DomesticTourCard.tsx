import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Tag, Star } from 'lucide-react';
import { TourCardProps, LanguageContent } from '../lib/types';
import { useLanguage } from '../context/LanguageContext';

const DomesticTourCard = forwardRef<HTMLDivElement, TourCardProps>(({ tour, currentPage }, ref) => { 
  const { t, language } = useLanguage();

  const getLocalizedContent = (content: LanguageContent) => {
    if (language === 'id' && content.id) return content.id;
    if (language === 'ru' && content.ru) return content.ru;
    return content.en;
  };

  const tourName = getLocalizedContent(tour.name);
  const tourDuration = getLocalizedContent(tour.duration);
  const tourLocation = getLocalizedContent(tour.location);
  const tourOverview = getLocalizedContent(tour.overview);

  const startingPriceNum = parseFloat(tour.starting_price || '0');
  const originalPriceNum = tour.original_price ? parseFloat(tour.original_price) : 0;

  const discountPercentage = originalPriceNum > startingPriceNum
    ? Math.round(((originalPriceNum - startingPriceNum) / originalPriceNum) * 100)
    : 0;

  const handleCardClick = () => {
    sessionStorage.setItem('lastViewedTourId', tour.id.toString());
    sessionStorage.setItem('lastViewedPage', currentPage.toString()); 
  };

  return (
    <div
      ref={ref} 
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group cursor-pointer"
      data-aos="fade-up"
    >
      <Link to={`/domestic-tours/${tour.slug}`} onClick={handleCardClick}>
        <div className="relative h-64 overflow-hidden">
          <img
            src={
              `${import.meta.env.VITE_BASE_URL}` +
              (tour.images.find(img => img.order === 0)?.path ?? '/placeholder.jpg')
            }
            alt={tourName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
              {discountPercentage}% OFF
            </div>
          )}
          {tour.rate && (
            <div className="absolute top-4 bg-white right-4 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-md">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span>{tour.rate}</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <MapPin className="w-4 h-4" />
            <span>{tourLocation}</span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
            {tourName}
          </h2>

          <p className="text-gray-600 mb-4 line-clamp-2">
            {tourOverview}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{tourDuration}</span>
              </div>
              {tour.code && (
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span>{tour.code}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-xs text-gray-500">{t('startingFrom')}</div>
              <div className="flex-col items-center gap-2">
                <div className="text-2xl font-bold text-gray-900">
                  {tour.currency || ''}{startingPriceNum.toLocaleString()}
                </div>
                {originalPriceNum > startingPriceNum && (
                  <div className="text-sm text-gray-400 line-through decoration-red-500 decoration-1">
                    {tour.currency || ''}{originalPriceNum.toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center gap-2 group/btn whitespace-nowrap">
              {t('viewDetails')}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
});

export default DomesticTourCard;

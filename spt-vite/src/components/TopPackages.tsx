import React, { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Clock, Tag, Star } from 'lucide-react';
import { TourPackage } from '../lib/types';
import { Link } from 'react-router-dom';
import { getTourPackages } from '../lib/api'; 
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';     

const TopPackages: React.FC = () => {
  const { t, language } = useLanguage();
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); 
      const response = await getTourPackages({ per_page: 3, tour_type: 1 });
      setTours(response.data); 
    } catch (err) {
      console.error("Failed to fetch tours:", err);
      setError(t('failedToLoadPackages') || "Failed to load tour packages. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [t]); 

  useEffect(() => {
    fetchTours();
  }, [fetchTours]); 

  const getLocalizedContent = (content: { en: string; id?: string; ru?: string }) => {
    if (language === 'id' && content.id) return content.id;
    if (language === 'ru' && content.ru) return content.ru;
    return content.en;
  };

  if (loading) {
    return (
      <section id="packages" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <LoadingSpinner /> 
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="packages" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ErrorDisplay message={error} onRetry={fetchTours} /> {/* Use ErrorDisplay with retry */}
        </div>
      </section>
    );
  }

  if (tours.length === 0) {
    return (
      <section id="packages" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">{t('noPackagesFound') || 'No tour packages found.'}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="packages" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-aos="fade-up"
          >
            {t('topPackages')}
          </h2>
          <p
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {t('topPackagesDetail')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour: TourPackage) => {
            const tourName = getLocalizedContent(tour.name);
            const tourDuration = getLocalizedContent(tour.duration);
            const tourLocation = getLocalizedContent(tour.location);
            const tourOverview = getLocalizedContent(tour.overview);

            const startingPriceNum = parseFloat(tour.starting_price || '0');
            const originalPriceNum = tour.original_price ? parseFloat(tour.original_price) : 0;

            const discountPercentage = originalPriceNum > startingPriceNum
              ? Math.round(((originalPriceNum - startingPriceNum) / originalPriceNum) * 100)
              : 0;

            return (
              <div
                key={tour.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group cursor-pointer"
              >
                <Link to={`/tours/${tour.slug}`}>
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

                    <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
                      {tourName}
                    </h3>

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
                        <div className="text-sm text-gray-500">{t('startingFrom')}</div>
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold text-gray-900">
                            {tour.currency || ''}{startingPriceNum.toLocaleString()}
                          </div>
                          {originalPriceNum > startingPriceNum && (
                            <div className="text-md text-gray-400 line-through decoration-red-500 decoration-2">
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
          })}
        </div>

        <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="200">
          <Link
            to="/tours"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-primary hover:bg-primary/90 transition-colors duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            {t('viewAllPackages')}
            <svg className="ml-3 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopPackages;

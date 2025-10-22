import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { TourPackage, LanguageContent } from '../lib/types';
import {
  MapPin, Clock, Tag, Star, Camera, CheckCircle, XCircle
} from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';
import BookingForm from '../components/BookingForm';
import ItineraryDocument from '../components/ItineraryDocument';
import { getTourPackageDetail } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import ImageModal from '../components/ImageModal';
import { setMetaTag, setLinkTag } from '../lib/seoUtils';

const TourDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, language: currentLanguage } = useLanguage();
  const [tour, setTour] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'includedExcluded' | 'itinerary' | 'pricing' | 'faq' | 'booking'>('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  const getLocalizedContent = useCallback((content: LanguageContent | undefined) => {
    if (!content) return ''; 
    if (currentLanguage === 'id') return content.id ?? content.en ?? '';
    if (currentLanguage === 'ru') return content.ru ?? content.en ?? '';
    return content.en ?? '';
  }, [currentLanguage]);

  const getLocalizedSeoTitle = useCallback(() => {
    if (!tour) return '';
    if (currentLanguage === 'id') return tour.seo_title_id || tour.seo_title_en || '';
    if (currentLanguage === 'ru') return tour.seo_title_ru || tour.seo_title_en || '';
    return tour.seo_title_en || '';
  }, [tour, currentLanguage]);

  const getLocalizedSeoDescription = useCallback(() => {
    if (!tour) return '';
    if (currentLanguage === 'id') return tour.seo_description_id || tour.seo_description_en || '';
    if (currentLanguage === 'ru') return tour.seo_description_ru || tour.seo_description_en || '';
    return tour.seo_description_en || '';
  }, [tour, currentLanguage]);

  const fetchTourDetail = async () => {
    if (!slug) {
      navigate('/domestic-tours');
      return;
    }
    const id = slug.split('-').pop();
    if (!id) {
      setError(t('domesticTourNotFound'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const foundTour = await getTourPackageDetail(id);
      setTour(foundTour);
    } catch (err) {
      console.error("Failed to fetch tour detail:", err);
      setError(t('failedToLoadDomesticTourDetails'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTourDetail();
  }, [slug]);

  useEffect(() => {
    if (tour) {
      document.title = getLocalizedSeoTitle();
      const descriptionContent = getLocalizedSeoDescription();
      setMetaTag('description', descriptionContent);

      const currentUrl = window.location.href;
      setLinkTag('canonical', currentUrl);
    }
  }, [tour, getLocalizedContent, getLocalizedSeoTitle, getLocalizedSeoDescription]); 

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <ErrorDisplay message={error} onRetry={fetchTourDetail} />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-base text-gray-700">{t('domesticTourNotFound')}</p>
      </div>
    );
  }

  const sortedImages = [...tour.images].sort((a, b) => {
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    return orderA - orderB;
  });

  const tabs = [
    { id: 'overview', label: t('overview') },
    { id: 'includedExcluded', label: t('whatsIncludedAndExcluded') },
    { id: 'itinerary', label: t('itinerary') },
    { id: 'faq', label: t('faq') },
    { id: 'pricing', label: t('pricingTab') },
    { id: 'booking', label: t('booking') }
  ];

  const startingPriceNum = parseFloat(tour.starting_price || '0');
  const originalPriceNum = tour.original_price ? parseFloat(tour.original_price) : 0;
  const discountPercentage = originalPriceNum > startingPriceNum
    ? Math.round(((originalPriceNum - startingPriceNum) / originalPriceNum) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/domestic-tours')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            aria-label={t('backToDomesticTours')}
          >
            <FaArrowLeft className="text-lg" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="relative">
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                {discountPercentage}{t('discountOff')}
              </div>
            )}
            <button
              onClick={() => setShowImageModal(true)}
              className="w-full h-96 rounded-2xl shadow-lg mb-4 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 block"
              aria-label={t('viewLargerImage')}
            >
              <img
                src={`${import.meta.env.VITE_BASE_URL}${sortedImages[selectedImageIndex]?.path}`}
                alt={getLocalizedContent(tour.name)}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </button>
            <div className="absolute bottom-6 right-6 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <Camera className="w-4 h-4" />
              {selectedImageIndex + 1} / {sortedImages.length}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {sortedImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}${image.path}`}
                    alt={`${getLocalizedContent(tour.name)} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{getLocalizedContent(tour.location)}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getLocalizedContent(tour.name)}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{getLocalizedContent(tour.duration)}</span>
                </div>
                {tour.code && (
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    <span>{tour.code}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{tour.rate}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('tourHighlights')}</h2>
              {tour.highlights && tour.highlights.length > 0 ? (
                <ul className="space-y-2">
                  {tour.highlights.map((highlight) => (
                    <li key={highlight.id} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{getLocalizedContent(highlight.description)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 italic">{t('noHighlightsAvailable') || 'No highlights available for this tour.'}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 overflow-scroll" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center
                  ${activeTab === tab.id ? 'border-blue-500 text-blue-600 gap-2' : 'border-transparent text-gray-500 hover:text-gray-700 justify-center'}
                `}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="w-full bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('tourOverview')}</h2>
                <p className="text-gray-700 leading-relaxed">
                  {getLocalizedContent(tour.overview)}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'includedExcluded' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  {t('whatsIncluded')}
                </h2>
                {tour.included_excluded.filter(item => item.type === 'included').length > 0 ? (
                  <ul className="space-y-3">
                    {tour.included_excluded
                      .filter(item => item.type === 'included')
                      .map((item) => (
                        <li key={item.id} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{getLocalizedContent(item.description)}</span>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 italic">{t('noIncludedItems') || 'No included items available.'}</p>
                )}
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <XCircle className="w-6 h-6 text-red-500" />
                  {t('whatsNotIncluded')}
                </h2>
                {tour.included_excluded.filter(item => item.type === 'excluded').length > 0 ? (
                  <ul className="space-y-3">
                    {tour.included_excluded
                      .filter(item => item.type === 'excluded')
                      .map((item) => (
                        <li key={item.id} className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{getLocalizedContent(item.description)}</span>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 italic">{t('noExcludedItems') || 'No excluded items available.'}</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'itinerary' && (
            tour.itineraries.length > 0 ? (
              <ItineraryDocument tour={tour} />
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <p className="text-gray-600 italic">{t('noItineraryAvailable') || 'No itinerary available for this tour.'}</p>
              </div>
            )
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('pricingInfo')}</h2>
                {tour.prices && tour.prices.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-4 px-6 font-semibold text-sm text-gray-900">{t('serviceType')}</th>
                          <th className="text-center py-4 px-6 font-semibold text-sm text-gray-900">{t('price')}</th>
                          <th className="text-left py-4 px-6 font-semibold text-sm text-gray-900">{t('description')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tour.prices.map((priceOption) => (
                          <tr key={priceOption.id} className="border-b border-gray-100">
                            <td className="py-4 px-6 font-medium text-md text-gray-900">{getLocalizedContent(priceOption.service_type)}</td>
                            <td className="py-4 px-6 text-center text-md font-bold text-blue-600">
                              {tour.currency || ''}{parseFloat(String(priceOption.price ?? '')).toLocaleString()}
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-600">{getLocalizedContent(priceOption.description)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600 italic">{t('noPricingInfo')}</p>
                )}
              </div>

              <div className="bg-yellow-50 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('cancellationPolicy')}</h2>
                {tour.cancellation_policies.length > 0 ? (
                  <ul className="space-y-2 text-gray-700">
                    {tour.cancellation_policies.map((policy) => (
                      <li key={policy.id}>
                        {getLocalizedContent(policy.description)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 italic">{t('noCancellationPolicy') || 'No cancellation policy available.'}</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('faq')}</h2>
              {tour.faqs.length > 0 ? (
                <div className="space-y-6">
                  {tour.faqs.map((faq) => (
                    <div key={faq.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                      <h3 className="font-semibold text-gray-900 mb-3">{getLocalizedContent(faq.question)}</h3>
                      <p className="text-gray-700">{getLocalizedContent(faq.answer)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 italic">{t('noFaqsAvailable') || 'No FAQs available for this tour.'}</p>
              )}
            </div>
          )}

          {activeTab === 'booking' && (
            <BookingForm tour={tour} />
          )}
        </div>
      </div>

      {showImageModal && (
        <ImageModal
          images={sortedImages.map(img => ({
            ...img,
            id: String(img.id)
          }))}
          currentIndex={selectedImageIndex}
          altText={getLocalizedContent(tour.name) || ''}
          onClose={() => setShowImageModal(false)}
          onNavigate={(newIndex) => setSelectedImageIndex(newIndex)}
        />
      )}
    </div>
  );
};

export default TourDetail;

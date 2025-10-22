import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false); 
  const [activeSection, setActiveSection] = useState('booking');
  const navRef = useRef<HTMLElement>(null);

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
      navigate('/tours');
      return;
    }

    const id = slug.split('-').pop();
    if (!id) {
      setError(t('tourNotFound'));
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
      setError(t('failedToLoadTourDetails'));
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

  useEffect(() => {
    if (!tour) return;

    const observerOptions = {
      root: null,
      rootMargin: '-150px 0px -50% 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [tour]);

  useEffect(() => {
    if (navRef.current && activeSection) {
      const activeTab = navRef.current.querySelector(`a[href="#${activeSection}"]`);
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    }
  }, [activeSection]);

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
        <p className="text-base text-gray-700">{t('tourNotFound')}</p>
      </div>
    );
  }

  const sortedImages = [...tour.images].sort((a, b) => {
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    return orderA - orderB;
  });

  const sections = [
    { id: 'booking', label: t('booking') },
    { id: 'overview', label: t('overview') },
    { id: 'includedExcluded', label: t('whatsIncludedAndExcluded') },
    { id: 'itinerary', label: t('itinerary') },
    { id: 'cancellationPolicy', label: t('cancellationPolicy') },
    { id: 'faq', label: t('faq') }
  ];

  const startingPriceNum = parseFloat(tour.starting_price || '0');
  const originalPriceNum = tour.original_price ? parseFloat(tour.original_price) : 0;
  const discountPercentage = originalPriceNum > startingPriceNum
    ? Math.round(((originalPriceNum - startingPriceNum) / originalPriceNum) * 100)
    : 0;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const stickyNav = document.querySelector('.sticky-nav');
      const offset = stickyNav ? stickyNav.getBoundingClientRect().height + 64 : 112; // Adjust based on navbar (64px) + sticky nav height
      const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/tours')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            aria-label={t('backToTours')}
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

      <div className="sticky top-[64px] z-20 w-full bg-white border-b border-gray-200 shadow-sm sticky-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav ref={navRef} className="flex space-x-2 overflow-x-auto" aria-label="Sections">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => handleNavClick(e, section.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center ${
                  activeSection === section.id
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-blue-500'
                }`}
              >
                <span>{section.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="w-full bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 space-y-12">
          <section id="booking">
            <BookingForm tour={tour} />
          </section>

          <section id="overview" className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('tourOverview')}</h2>
            <p className="text-gray-700 leading-relaxed">
              {getLocalizedContent(tour.overview)}
            </p>
          </section>

          <section id="includedExcluded" className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
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
          </section>

          <section id="itinerary">
            {tour.itineraries.length > 0 ? (
              <ItineraryDocument tour={tour} />
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('itinerary')}</h2>
                <p className="text-gray-600 italic">{t('noItineraryAvailable') || 'No itinerary available for this tour.'}</p>
              </div>
            )}
          </section>

          <section id="cancellationPolicy" className="space-y-8">
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
          </section>

          <section id="faq" className="bg-white rounded-2xl p-8 shadow-sm">
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
          </section>
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
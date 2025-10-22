import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import { useLanguage } from '../context/LanguageContext';
import galleryData from '../data/gallery.json';
import { GalleryImage, GalleryCategory, GalleryData } from '../lib/types'; 

const Gallery: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | null>(null);
  const sliderRef = useRef<Slider>(null);

  const typedGalleryData: GalleryData = galleryData;

  const openSlideshow = (category: GalleryCategory) => {
    setSelectedCategory(category);
  };

  const closeSlideshow = () => {
    setSelectedCategory(null);
  };

  const getCategoryName = (cat: GalleryCategory) => {
    if (language === 'id') return cat.nameId;
    if (language === 'ru') return cat.nameRu || cat.nameEn;
    return cat.nameEn;
  };

  const gallerySliderSettings = {
    infinite: true,
    speed: 10000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  const modalSliderSettings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: false,
    swipeToSlide: true,
    draggable: true,
  };

  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-aos="fade-up"
          >
            {t('galleryTitle')}
          </h2>
          <p
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {t('gallerySubtitle')}
          </p>
        </div>

        <div data-aos="fade-up">
          <Slider {...gallerySliderSettings}>
            {typedGalleryData.galleries.map((cat: GalleryCategory) => (
              <div key={cat.id} className="px-2">
                <div
                  className="relative overflow-hidden rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105"
                  onClick={() => openSlideshow(cat)}
                >
                  <img
                    src={`${cat.images[0].url}`}
                    alt={getCategoryName(cat)}
                    className="w-full h-64 object-cover"
                    loading="lazy" 
                  />
                  <img
                    src="/spt_logo.png"
                    alt="logo"
                    className="absolute top-2 right-2 w-8 h-8 opacity-90 rounded-full bg-white"
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-800 text-center">
                  {getCategoryName(cat)}
                </h3>
              </div>
            ))}
          </Slider>
        </div>

        {selectedCategory && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={closeSlideshow}
            aria-modal="true"
            role="dialog"
          >
            <div
              className="relative w-full max-w-4xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-12 right-0 text-white text-4xl z-20 md:top-0 md:-right-12"
                onClick={closeSlideshow}
                aria-label={t('close')}
              >
                &times;
              </button>

              <div className="relative">
                <Slider ref={sliderRef} {...modalSliderSettings}>
                  {selectedCategory.images.map((image: GalleryImage) => (
                    <div key={image.id} className="relative">
                      <img
                        src={`${image.url}`}
                        alt={getCategoryName(selectedCategory)}
                        className="w-full h-[70vh] object-contain"
                        loading="lazy" 
                      />
                      <img
                        src="/spt_logo.png"
                        alt="logo"
                        className="absolute top-4 right-4 w-10 h-10 md:w-12 md:h-12 opacity-90 rounded-full bg-white"
                      />
                    </div>
                  ))}
                </Slider>

                <button
                  className="absolute -left-12 top-1/2 transform -translate-y-1/2 text-white text-4xl hidden md:block"
                  onClick={(e) => {
                    e.stopPropagation();
                    sliderRef.current?.slickPrev();
                  }}
                  aria-label={t('previous')}
                >
                  ‹
                </button>
                <button
                  className="absolute -right-12 top-1/2 transform -translate-y-1/2 text-white text-4xl hidden md:block"
                  onClick={(e) => {
                    e.stopPropagation();
                    sliderRef.current?.slickNext();
                  }}
                  aria-label={t('next')}
                >
                  ›
                </button>

                <div className="flex justify-center mt-4 space-x-8 md:hidden">
                  <button
                    className="text-white text-3xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      sliderRef.current?.slickPrev();
                    }}
                    aria-label={t('previous')}
                  >
                    ‹
                  </button>
                  <button
                    className="text-white text-3xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      sliderRef.current?.slickNext();
                    }}
                    aria-label={t('next')}
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;

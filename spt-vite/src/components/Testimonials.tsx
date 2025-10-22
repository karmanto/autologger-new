import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import testimonialsData from '../data/testimonials.json';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Testimonial } from '../lib/types'; 

const Testimonials: React.FC = () => {
  const { t, language } = useLanguage();
  const sliderRef = useRef<Slider>(null);

  const testimonials: Testimonial[] = testimonialsData as Testimonial[];

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickPlay();
    }
  }, []);

  const testimonialSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <section className="py-16 bg-blue-50">
      <style>{`
        .testimonial-slider .slick-track {
          display: flex;
          align-items: stretch;
          padding-bottom: 20px; /* Ruang ekstra untuk shadow */
        }
        
        .testimonial-slider .slick-slide {
          height: auto !important;
        }
        
        .testimonial-slider .slick-slide > div {
          height: 100%;
          padding-bottom: 20px; /* Ruang ekstra untuk shadow */
        }
        
        .testimonial-slider .slick-list {
          overflow: hidden; /* Memastikan shadow terlihat penuh */
          margin: -10px 0; /* Kompensasi untuk ruang tambahan */
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-aos="fade-up"
          >
            {t('testimoni')}
          </h2>
          <p 
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {t('testimoniDetail')}
          </p>
        </div>
        
        <div className="relative">
          <Slider 
            ref={sliderRef} 
            {...testimonialSliderSettings}
            className="testimonial-slider"
          >
            {testimonials.map((testimonial: Testimonial) => ( 
              <div key={testimonial.id} className="px-2 h-full">
                <article 
                  className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col" 
                  itemScope
                  itemType="https://schema.org/Review"
                >
                  <div className="flex items-center mb-4">
                    <img 
                      src={`${testimonial.image}`} 
                      alt={`${testimonial.name} - Customer from ${testimonial.location}`} 
                      className="w-12 h-12 rounded-full object-cover mr-4"
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900" itemProp="author" itemScope itemType="https://schema.org/Person">
                        <span itemProp="name">{testimonial.name}</span>
                      </h3>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex mb-4" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                    <meta itemProp="ratingValue" content={testimonial.rating.toString()} />
                    <meta itemProp="bestRating" content="5" />
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg 
                        key={i}
                        className="w-5 h-5 text-yellow-400" 
                        fill="currentColor" 
                        viewBox="0 0 20 20" 
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <div className="flex-grow mb-4">
                    <p className="text-gray-700 italic" itemProp="reviewBody">
                      "{
                        language === 'id'
                          ? testimonial.comment_id
                          : language === 'ru'
                          ? testimonial.comment_ru
                          : testimonial.comment_en
                      }"
                    </p>
                  </div>
                  <meta itemProp="itemReviewed" itemScope itemType="https://schema.org/TravelAgency" content="Simbolon Phuket Tour" />
                </article>
              </div>
            ))}
          </Slider>

          <button
            className="absolute top-1/2 -left-4 z-20 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-blue-100 transition-all hidden md:block"
            onClick={() => sliderRef.current?.slickPrev()}
            aria-label={t('previous')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="absolute top-1/2 -right-4 z-20 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-blue-100 transition-all hidden md:block"
            onClick={() => sliderRef.current?.slickNext()}
            aria-label={t('next')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

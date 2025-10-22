import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import PromoCard from './PromoCard';
import { CountdownState, Promo } from '../lib/types';
import { getPromos } from '../lib/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

const PromoSection: React.FC = () => {
  const { t } = useLanguage();
  const [promos, setPromos] = useState<Promo[]>([]);
  const [countdowns, setCountdowns] = useState<{ [key: string]: CountdownState }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPromosData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); 
      const data = await getPromos();
      setPromos(data);
    } catch (err) {
      console.error('Failed to fetch promos:', err);
      setError(t('failedToLoadPromos') || 'Failed to load promotions. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchPromosData();
  }, [fetchPromosData]);

  useEffect(() => {
    if (promos.length === 0 && !loading) {
      setCountdowns({});
      return;
    }

    const updateCountdowns = () => {
      const now = new Date().getTime();
      const newCountdowns: { [key: string]: CountdownState } = {};

      promos.forEach((promo) => {
        const endTime = new Date(promo.end_date).getTime();
        const timeLeft = endTime - now;

        if (timeLeft > 0) {
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          newCountdowns[promo.id.toString()] = { days, hours, minutes, seconds };
        }
      });

      setCountdowns(prevCountdowns => {
        const prevKeys = Object.keys(prevCountdowns);
        const newKeys = Object.keys(newCountdowns);

        if (prevKeys.length !== newKeys.length) {
          return newCountdowns;
        }

        for (const key of newKeys) {
          const prev = prevCountdowns[key];
          const current = newCountdowns[key];

          if (!prev || prev.days !== current.days || prev.hours !== current.hours ||
              prev.minutes !== current.minutes || prev.seconds !== current.seconds) {
            return newCountdowns;
          }
        }

        return prevCountdowns;
      });
    };

    updateCountdowns();

    const timer = setInterval(updateCountdowns, 1000);

    return () => clearInterval(timer);
  }, [promos, loading]); 

  if (loading) {
    return (
      <section id="promo" className="py-16 bg-gray-50 flex justify-center items-center min-h-[300px]">
        <LoadingSpinner />
      </section>
    );
  }

  if (error) {
    return (
      <section id="promo" className="py-16 bg-gray-50 flex justify-center items-center min-h-[300px]">
        <ErrorDisplay message={error} onRetry={fetchPromosData} />
      </section>
    );
  }

  if (promos.length === 0 && !loading) {
    return (
      <section id="promo" className="py-16 bg-gray-50 flex justify-center items-center min-h-[300px]">
        <p className="text-lg text-gray-600">{t('noPromosAvailable') || 'No promotions available at the moment.'}</p>
      </section>
    );
  }

  return (
    <section id="promo" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#102d5e] mb-4">
            {t('promoDesc1')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('promoDesc2')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="200">
          {promos.map((promo) => (
            <PromoCard
              key={promo.id}
              promo={promo}
              countdown={countdowns[promo.id.toString()]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoSection;

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BookingFormProps } from '../lib/types';
import nationalities from '../data/nationalities.json'; 

const BookingForm: React.FC<BookingFormProps> = ({ tour }) => {
  const { t, language } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [nationality, setNationality] = useState('');
  const [hotelName, setHotelName] = useState(''); 
  const [notes, setNotes] = useState(''); 
  const [quantities, setQuantities] = useState<{ [id: number]: number }>({});
  const [totalCost, setTotalCost] = useState(0);

  const whatsappContactNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const telegramUsername = import.meta.env.VITE_TELEGRAM_USERNAME;

  const uniqueNationalities = [...new Set(nationalities)].sort();

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    setDate(getMinDate());
  }, []);

  useEffect(() => {
    if (tour && tour.prices && tour.prices.length > 0) {
      const initialQuantities: { [id: number]: number } = {};
      tour.prices.forEach((option, index) => {
        if (option.id !== undefined) {
          // CRITICAL: Set the quantity of the first price option (index 0) to 1
          initialQuantities[option.id] = index === 0 ? 1 : 0;
        }
      });
      setQuantities(initialQuantities);
    }
  }, [tour]);

  useEffect(() => {
    let calculatedTotal = 0;
    if (tour && tour.prices) {
      tour.prices.forEach(option => {
        if (option.id !== undefined) {
          const qty = quantities[option.id] || 0;
          calculatedTotal += option.price * qty;
        }
      });
    }
    setTotalCost(calculatedTotal);
  }, [quantities, tour]);

  const getLocalizedContent = (content: { en: string; id?: string; ru?: string }) => {
    if (language === 'id') return content.id;
    if (language === 'ru') return content.ru || content.en;
    return content.en;
  };

  const handleQuantityChange = (optionId: number, value: string) => {
    const newQuantity = value === '' ? 0 : Math.max(0, parseInt(value) || 0);
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [optionId]: newQuantity,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tour || !tour.prices || tour.prices.length === 0) {
      alert(t('bookingErrorInvalidTour'));
      return;
    }

    const hasSelections = Object.values(quantities).some(qty => qty > 0);
    if (!hasSelections) {
      alert(t('atLeastOneParticipant'));
      return;
    }

    const tourName = getLocalizedContent(tour.name);
    const tourCode = tour.code || 'N/A';

    let serviceDetails = '';
    tour.prices.forEach((option, index) => {
      if (option.id !== undefined) {
        const qty = quantities[option.id] || 0;
        if (qty > 0) {
          const serviceType = getLocalizedContent(option.service_type);
          const description = getLocalizedContent(option.description);
          serviceDetails += `- ${serviceType}${description ? ` (${description})` : ''}: ${qty} x ${tour.currency || ''}${option.price.toLocaleString()} = ${tour.currency || ''}${(option.price * qty).toLocaleString()}
`;
          if (!index) {
            serviceDetails = `
- ${serviceType}${description ? ` (${description})` : ''}: ${qty} x ${tour.currency || ''}${option.price.toLocaleString()} = ${tour.currency || ''}${(option.price * qty).toLocaleString()}
`;
          }
        }
      }
    });

    const message = `
${t('hello')} SPT! ${t('iWantToBookTour')}

${t('tourName')}: ${tourName} (${tourCode})
${t('fullName')}: ${name}
${t('emailAddress')}: ${email}
${t('dateOfTour')}: ${date}
${t('nationality')}: ${nationality || t('notSpecified')}
${t('hotelName')}: ${hotelName || t('notSpecified')}
${t('serviceType')}: 
${serviceDetails}
${t('totalCost')}: ${tour.currency || ''}${totalCost.toLocaleString()}
${notes ? `${t('notes')}: ${notes}` : ''}

${t('lookingForwardToConfirmation')}
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://${language === 'ru' ? `t.me/${telegramUsername}` : `wa.me/${whatsappContactNumber}`}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('bookingFormTitle')}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            {t('fullName')}
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 transition-all duration-200"
            placeholder={t('enterFullName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('emailAddress')}
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 transition-all duration-200"
            placeholder={t('enterEmail')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            {t('dateOfTour')}
          </label>
          <input
            type="date"
            id="date"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 transition-all duration-200"
            min={getMinDate()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
            {t('nationality')}
          </label>
          <select
            id="nationality"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 transition-all duration-200 appearance-none pr-10 custom-select-arrow"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            required
          >
            <option value="">{t('selectNationality')}</option>
            {uniqueNationalities.map((nat) => (
              <option key={nat} value={nat}>{nat}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="hotelName" className="block text-sm font-medium text-gray-700 mb-1">
            {t('hotelName')} ({t('optional')})
          </label>
          <input
            type="text"
            id="hotelName"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 transition-all duration-200"
            placeholder={t('enterHotelName')}
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            {t('notes')} ({t('optional')})
          </label>
          <textarea
            id="notes"
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 transition-all duration-200"
            placeholder={t('enterAnyNotes')}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        {tour.prices && tour.prices.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('numberOfBookings')}</h3>
            {tour.prices.map((option) => (
              <div key={option.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex-1 mb-4 sm:mb-0 sm:mr-4">
                  <div className="font-medium text-gray-900">{getLocalizedContent(option.service_type)} </div>
                  <div className="text-sm text-gray-600 block">{getLocalizedContent(option.description)}</div>
                  <div className="text-md font-bold text-blue-600">{tour.currency || ''}{parseFloat(String(option.price ?? '')).toLocaleString()}</div>
                </div>
                <div className="flex items-center border border-gray-300 rounded-md shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(option.id!, String(Math.max(0, (quantities[option.id!] || 0) - 1)))}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    disabled={(quantities[option.id!] || 0) <= 0}
                    aria-label={`Decrease quantity for ${getLocalizedContent(option.service_type)}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                  </button>
                  <label htmlFor={`quantity-${option.id}`} className="sr-only">{t('quantity')} for {getLocalizedContent(option.service_type)}</label>
                  <input
                    type="number"
                    id={`quantity-${option.id}`}
                    min="0"
                    className="w-16 text-center border-x border-gray-300 focus:outline-none focus:ring-0 sm:text-sm px-1 py-2 no-spin-buttons"
                    value={quantities[option.id!] ?? 0}
                    onChange={(e) => handleQuantityChange(option.id!, e.target.value)}
                    aria-label={`${t('quantity')} for ${getLocalizedContent(option.service_type)}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(option.id!, String((quantities[option.id!] || 0) + 1))}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    aria-label={`Increase quantity for ${getLocalizedContent(option.service_type)}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 italic">{t('noPricingInfo') || 'No pricing information available for this tour.'}</p>
        )}

        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
          <span className="text-lg font-semibold text-gray-900">{t('totalCost')}:</span>
          <span className="text-2xl font-bold text-blue-600">{tour.currency || ''}{totalCost.toLocaleString()}</span>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-semibold transition-colors"
          disabled={!tour.prices || tour.prices.length === 0}
        >
          {t('confirmBooking')}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;

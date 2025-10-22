import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import faqData from '../data/faq.json';
import { FAQItem, FAQData } from '../lib/types';

const FAQ: React.FC = () => {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 3;

  const typedFaqData: FAQData = faqData;

  const displayedFaqs: FAQItem[] = showAll ? typedFaqData.faqs : typedFaqData.faqs.slice(0, initialDisplayCount);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getQuestion = (faq: FAQItem) => {
    switch (language) {
      case 'id':
        return faq.questionId;
      case 'ru':
        return faq.questionRu || faq.questionEn;
      default:
        return faq.questionEn;
    }
  };

  const getAnswer = (faq: FAQItem) => {
    switch (language) {
      case 'id':
        return faq.answerId;
      case 'ru':
        return faq.answerRu || faq.answerEn;
      default:
        return faq.answerEn;
    }
  };

  return (
    <section id="faq" className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-aos="fade-up"
          >
            {t('faqTitle')}
          </h2>
          <p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {t('faqSubtitle')}
          </p>
        </div>
        <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
          {displayedFaqs.map((faq, index) => (
            <div
              key={faq.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={index * 100}
              itemScope
              itemType="https://schema.org/Question"
            >
              <button
                className="flex justify-between items-center w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleAccordion(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <span className="text-lg font-medium text-gray-900" itemProp="name">
                  {getQuestion(faq)}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`transition-all duration-300 overflow-hidden ${openIndex === index ? 'max-h-96 py-4' : 'max-h-0 py-0'}`}
                id={`faq-answer-${faq.id}`}
                itemScope
                itemType="https://schema.org/Answer"
              >
                <div className="px-6 text-gray-600" itemProp="text">
                  {getAnswer(faq)}
                </div>
              </div>
            </div>
          ))}
        </div>
        {typedFaqData.faqs.length > initialDisplayCount && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors hover:-translate-y-1 hover:scale-105 duration-300"
              aria-label={showAll ? t('showLess') : t('showMore')}
            >
              {showAll ? t('showLess') : t('showMore')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQ;

import React, { useState, useEffect } from 'react';
import { getSEOContent } from '../../../lib/api';
import { SEOContent, PageSEO, Language } from '../../../lib/types';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useLanguage } from '../../../context/LanguageContext';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';

const initialPageSEO: PageSEO = {
  title: '',
  description: '',
  author: '',
  robots: '',
  canonicalUrl: '',
  hreflang: {},
};

const initialSEOContent: SEOContent = {
  home: {
    id: { ...initialPageSEO },
    en: { ...initialPageSEO },
    ru: { ...initialPageSEO },
  },
  blogs: {
    id: { ...initialPageSEO },
    en: { ...initialPageSEO },
    ru: { ...initialPageSEO },
  },
  tours: {
    id: { ...initialPageSEO },
    en: { ...initialPageSEO },
    ru: { ...initialPageSEO },
  },
  intlTours: {
    id: { ...initialPageSEO },
    en: { ...initialPageSEO },
    ru: { ...initialPageSEO },
  },
  domesticTours: {
    id: { ...initialPageSEO },
    en: { ...initialPageSEO },
    ru: { ...initialPageSEO },
  },
};

const SeoShow: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [seoData, setSeoData] = useState<SEOContent>(initialSEOContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const languages: Language[] = ['id', 'en', 'ru'];
  const pageKeys: (keyof SEOContent)[] = ['home', 'blogs', 'tours', 'intlTours', 'domesticTours'];

  useEffect(() => {
    const fetchSeoData = async () => {
      try {
        setLoading(true);
        const data = await getSEOContent();
        const mergedData = pageKeys.reduce((acc, pageKey) => {
          acc[pageKey] = languages.reduce((langAcc, lang) => {
            const initialLangContent = initialSEOContent[pageKey]?.[lang] || initialPageSEO; 
            const fetchedLangContent = data[pageKey]?.[lang];

            langAcc[lang] = {
              title: fetchedLangContent?.title ?? initialLangContent.title,
              description: fetchedLangContent?.description ?? initialLangContent.description,
              author: fetchedLangContent?.author ?? initialLangContent.author,
              robots: fetchedLangContent?.robots ?? initialLangContent.robots,
              canonicalUrl: fetchedLangContent?.canonicalUrl ?? initialLangContent.canonicalUrl,
              hreflang: {
                ...initialLangContent.hreflang,
                ...fetchedLangContent?.hreflang,
              },
            };
            return langAcc;
          }, {} as { [key in Language]?: PageSEO }); 
          return acc;
        }, {} as SEOContent);
        setSeoData(mergedData);
      } catch (err) {
        setError(t('Failed to load SEO settings.'));
        console.error('Error fetching SEO content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeoData();
  }, [t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Helmet>
        <title>{t('Admin')} | {t('SEO Settings Overview')}</title>
      </Helmet>
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{t('SEO Settings Overview')}</h1>
          <button
            onClick={() => navigate('/admin/seo-settings/edit')}
            className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
          >
            <Edit className="h-4 w-4 mr-2" />
            {t('Edit SEO Settings')}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">{t('Error!')}</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <div className="space-y-8">
          {pageKeys.map((page) => (
            <div key={page as string} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 capitalize">{t(page)} {t('Page')} {t('SEO Overview')}</h2>
              {languages.map((lang) => (
                <div key={`${page}-${lang}`} className="mb-6 p-4 border-l-4 border-primary bg-gray-50 rounded-md">
                  <h3 className="text-xl font-medium text-gray-800 mb-3 uppercase">{t(lang)}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="block text-sm font-medium text-gray-700">{t('Title')} ({lang.toUpperCase()}):</p>
                      <p className="mt-1 text-gray-900 bg-white p-2 rounded-md border border-gray-300 min-h-[38px]">
                        {seoData[page]?.[lang]?.title || t('Not set')}
                      </p>
                    </div>
                    <div>
                      <p className="block text-sm font-medium text-gray-700">{t('Description')} ({lang.toUpperCase()}):</p>
                      <p className="mt-1 text-gray-900 bg-white p-2 rounded-md border border-gray-300 min-h-[38px]">
                        {seoData[page]?.[lang]?.description || t('Not set')}
                      </p>
                    </div>
                    {seoData[page]?.[lang]?.author && (
                      <div>
                        <p className="block text-sm font-medium text-gray-700">{t('Author')} ({lang.toUpperCase()}):</p>
                        <p className="mt-1 text-gray-900 bg-white p-2 rounded-md border border-gray-300 min-h-[38px]">
                          {seoData[page]?.[lang]?.author}
                        </p>
                      </div>
                    )}
                    {seoData[page]?.[lang]?.robots && (
                      <div>
                        <p className="block text-sm font-medium text-gray-700">{t('Robots')} ({lang.toUpperCase()}):</p>
                        <p className="mt-1 text-gray-900 bg-white p-2 rounded-md border border-gray-300 min-h-[38px]">
                          {seoData[page]?.[lang]?.robots}
                        </p>
                      </div>
                    )}
                    {seoData[page]?.[lang]?.canonicalUrl && (
                      <div>
                        <p className="block text-sm font-medium text-gray-700">{t('Canonical URL')} ({lang.toUpperCase()}):</p>
                        <p className="mt-1 text-gray-900 bg-white p-2 rounded-md border border-gray-300 min-h-[38px]">
                          {seoData[page]?.[lang]?.canonicalUrl}
                        </p>
                      </div>
                    )}
                    {seoData[page]?.[lang]?.hreflang && Object.keys(seoData[page]![lang]!.hreflang!).length > 0 && (
                      <div>
                        <p className="block text-sm font-medium text-gray-700">{t('Hreflang Links')} ({lang.toUpperCase()}):</p>
                        <div className="mt-1 text-gray-900 bg-white p-2 rounded-md border border-gray-300 min-h-[38px]">
                          {Object.entries(seoData[page]![lang]!.hreflang!).map(([hreflangLang, url]) => (
                            <p key={hreflangLang} className="text-xs">
                              <strong>{hreflangLang.toUpperCase()}:</strong> {url}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeoShow;

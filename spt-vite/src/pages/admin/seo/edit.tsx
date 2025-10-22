import React, { useState, useEffect, useCallback } from 'react';
import { getSEOContent, updateSEOContent } from '../../../lib/api';
import { SEOContent, PageSEO, Language, HreflangLinks } from '../../../lib/types'; 
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useLanguage } from '../../../context/LanguageContext';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

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

const SeoEdit: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [seoData, setSeoData] = useState<SEOContent>(initialSEOContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleChange = useCallback(
    (
      page: keyof SEOContent,
      lang: Language,
      field: keyof PageSEO, 
      value: string | HreflangLinks 
    ) => {
      if (field !== 'title' && field !== 'description') {
        return;
      }

      setSeoData((prevData: SEOContent) => {
        const newData = { ...prevData };
        if (!newData[page]) {
          newData[page] = {};
        }
        if (!newData[page]![lang]) {
          newData[page]![lang] = { ...initialPageSEO }; 
        }

        newData[page]![lang] = {
          ...newData[page]![lang],
          [field]: value,
        };

        return newData;
      });
    },
    [initialPageSEO]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateSEOContent(seoData);
      setSuccess(t('SEO settings updated successfully!'));
      navigate('/admin/seo-settings');
    } catch (err) {
      setError(t('Failed to update SEO settings.'));
      console.error('Error updating SEO content:', err);
    } finally {
      setSaving(false);
    }
  };

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
        <title>{t('Admin')} | {t('Edit SEO Settings')}</title>
      </Helmet>
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('Edit SEO Settings')}</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">{t('Error!')}</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">{t('Success!')}</strong>
            <span className="block sm:inline"> {success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {pageKeys.map((page) => (
            <div key={page as string} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 capitalize">{t(page)} {t('Page')} {t('SEO Settings')}</h2>
              {languages.map((lang) => (
                <div key={`${page}-${lang}`} className="mb-6 p-4 border-l-4 border-primary bg-gray-50 rounded-md">
                  <h3 className="text-xl font-medium text-gray-800 mb-3 uppercase">{t(lang)}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`${page}-${lang}-title`} className="block text-sm font-medium text-gray-700">
                        {t('Title')} ({lang.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        id={`${page}-${lang}-title`}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 bg-white text-gray-900"
                        value={seoData[page]?.[lang]?.title || ''}
                        onChange={(e) => handleChange(page, lang, 'title', e.target.value)}
                        maxLength={255}
                      />
                      <p className="mt-1 text-xs text-gray-500">{t('Max 255 characters.')}</p>
                    </div>
                    <div>
                      <label htmlFor={`${page}-${lang}-description`} className="block text-sm font-medium text-gray-700">
                        {t('Description')} ({lang.toUpperCase()})
                      </label>
                      <textarea
                        id={`${page}-${lang}-description`}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 bg-white text-gray-900"
                        value={seoData[page]?.[lang]?.description || ''}
                        onChange={(e) => handleChange(page, lang, 'description', e.target.value)}
                        maxLength={500}
                      ></textarea>
                      <p className="mt-1 text-xs text-gray-500">{t('Max 500 characters.')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
              disabled={saving}
            >
              {saving ? (
                <>
                  <LoadingSpinner className="h-5 w-5 mr-2" />
                  {t('Saving...')}
                </>
              ) : (
                t('Save SEO Settings')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeoEdit;

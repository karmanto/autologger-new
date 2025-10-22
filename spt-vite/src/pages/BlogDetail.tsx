import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Blog } from '../lib/types';
import { getBlogDetail } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import { FaArrowLeft } from 'react-icons/fa';
import { CalendarDays, Tag } from 'lucide-react';
import { setMetaTag, setLinkTag } from '../lib/seoUtils';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>(); 
  const navigate = useNavigate();
  const { t, language: currentLanguage } = useLanguage();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  const getLocalizedTitle = useCallback(() => {
    if (!blog) return '';
    if (currentLanguage === 'id') return blog.title_id;
    if (currentLanguage === 'ru') return blog.title_ru || blog.title_en;
    return blog.title_en;
  }, [blog, currentLanguage]);

  const getLocalizedContent = useCallback(() => {
    if (!blog) return '';
    if (currentLanguage === 'id') return blog.content_id;
    if (currentLanguage === 'ru') return blog.content_ru || blog.content_en;
    return blog.content_en;
  }, [blog, currentLanguage]);

  const getLocalizedSeoTitle = useCallback(() => {
    if (!blog) return '';
    if (currentLanguage === 'id') return blog.seo_title_id || blog.seo_title_en || '';
    if (currentLanguage === 'ru') return blog.seo_title_ru || blog.seo_title_en || '';
    return blog.seo_title_en || '';
  }, [blog, currentLanguage]);

  const getLocalizedSeoDescription = useCallback(() => {
    if (!blog) return '';
    if (currentLanguage === 'id') return blog.seo_description_id || blog.seo_description_en || '';
    if (currentLanguage === 'ru') return blog.seo_description_ru || blog.seo_description_en || '';
    return blog.seo_description_en || '';
  }, [blog, currentLanguage]);

  const fetchBlogDetail = async () => {
    if (!slug) {
      navigate('/blogs');
      return;
    }
    const id = slug.split('-').pop();
    if (!id) {
      setError(t('blogNotFound'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const foundBlog = await getBlogDetail(id); 
      setBlog(foundBlog);
    } catch (err) {
      console.error("Failed to fetch blog detail:", err);
      setError(t('failedToLoadBlogDetails'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBlogDetail();
  }, [slug]); 

  useEffect(() => {
    if (blog) {
      document.title = getLocalizedSeoTitle();

      const descriptionContent = getLocalizedSeoDescription();
      setMetaTag('description', descriptionContent);

      const currentUrl = window.location.href;
      setLinkTag('canonical', currentUrl);
    }
  }, [blog, getLocalizedSeoTitle, getLocalizedSeoDescription]); 

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
        <ErrorDisplay message={error} onRetry={fetchBlogDetail} />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-base text-gray-700">{t('blogNotFound')}</p>
      </div>
    );
  }

  const formattedDate = new Date(blog.posting_date).toLocaleDateString(currentLanguage === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <style>{`
        /* Target h2 directly within blog-detail-content */
        .blog-detail-content h2 {
          font-size: 1.5rem !important; /* text-2xl (24px) for mobile */
          line-height: 2rem !important; /* leading-8 */
          margin-top: 2em;
          margin-bottom: 1em;
        }

        @media (min-width: 768px) { /* md breakpoint and up */
          .blog-detail-content h2 {
            font-size: 1.875rem !important; /* text-3xl (30px) for desktop */
            line-height: 2.25rem !important; /* leading-9 */
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/blogs')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            aria-label={t('backToBlogs')}
          >
            <FaArrowLeft className="text-lg" />
            <span className="ml-2">{t('backToBlogs')}</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-8 md:p-10">
          <img
            src={`${import.meta.env.VITE_BASE_URL}/storage/${blog.image}`}
            alt={getLocalizedTitle()}
            className="w-full h-80 object-contain rounded-xl mb-8 shadow-md"
          />

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            {getLocalizedTitle()}
          </h1>

          <div className="flex text-sm text-gray-500 mb-4 w-full">
            <div className='flex mr-4'>
              <CalendarDays className="w-4 h-4 mr-1" />
              <span>{formattedDate}</span>
            </div>
            <div className='flex'>
              <Tag className="w-4 h-4 mr-1" />
              <span>{blog.category ?? "-"}</span>
            </div>
          </div>

          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed blog-detail-content"
            dangerouslySetInnerHTML={{ __html: getLocalizedContent() }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;

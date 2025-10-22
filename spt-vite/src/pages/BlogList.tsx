import React, { useState, useEffect, useRef } from 'react';
import { getBlogs } from '../lib/api';
import { Blog, OutletContext } from '../lib/types';
import BlogCard from '../components/BlogCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import { useLanguage } from '../context/LanguageContext';
import { Search } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const BlogList: React.FC = () => {
  const { t } = useLanguage();

  const { searchTerm, selectedCategory, setSearchTerm, setSelectedCategory } = useOutletContext<OutletContext>();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(() => {
  const storedPage = sessionStorage.getItem('lastViewedPage');
    if (storedPage) {
      return parseInt(storedPage, 10);
    }
    return 1;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const blogsPerPage = 12;


  const blogCardRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());
  const filtersContainerRef = useRef<HTMLDivElement>(null); 

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBlogs({
        page: currentPage,
        per_page: blogsPerPage,
        search: debouncedSearchTerm,
        category: selectedCategory,
      });
      setBlogs(response.data);
      setTotalPages(response.pagination.last_page);
      sessionStorage.removeItem('lastViewedPage');
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setError(t('failedToLoadBlogs'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, debouncedSearchTerm, selectedCategory]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 2000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (!loading && blogs.length > 0) {
      const lastViewedBlogId = sessionStorage.getItem('lastViewedBlogId');
      if (lastViewedBlogId) {
        const tourIdNum = parseInt(lastViewedBlogId, 10);
        const targetCard = blogCardRefs.current.get(tourIdNum);
        if (targetCard) {
          requestAnimationFrame(() => {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
          sessionStorage.removeItem('lastViewedBlogId'); 
        }
      }
    }
  }, [loading, blogs]); 

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const blogFilterOptions = [
    { label: 'tips', category: 'blog_tips' },
    { label: 'kuliner', category: 'blog_kuliner'},
    { label: 'budaya', category: 'blog_budaya'},
    { label: 'testimoni', category: 'blog_testimoni'},
    { label: 'berita', category: 'blog_berita'},
    { label: 'inspirasi', category: 'blog_inspirasi'},
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8" data-aos="fade-up">
          {t('ourBlog')}
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          {t('blogIntroText')}
        </p>

        <div className="mb-10 flex justify-center" data-aos="fade-up" data-aos-delay="200">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder={t('searchBlogsPlaceholder')}
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        <div
          ref={filtersContainerRef}
          className="flex overflow-x-auto pb-4 mb-6 -mx-4 px-4 scrollbar-hide"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="flex space-x-3 min-w-max">
            {blogFilterOptions.map((option, index) => {
              const isActive = selectedCategory === option.label;
              return (
                <button
                  key={index}
                  onClick={() => handleFilter(option.label)}
                  className={`flex items-center px-4 py-2 text-sm rounded-full font-medium transition-all duration-300 ease-in-out shadow-lg whitespace-nowrap
                    ${isActive
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  {t(option.category)}
                </button>
              );
            })}
            <button
              onClick={handleResetFilters}
              className={`flex items-center px-4 py-2 text-sm rounded-full font-medium transition-all duration-300 ease-in-out shadow-lg whitespace-nowrap
                ${selectedCategory === '' && searchTerm === ''
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
            >
              {t('allBlogs')}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <ErrorDisplay message={error} onRetry={fetchBlogs} />
        ) : blogs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">{t('noBlogsFound')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <BlogCard 
                  key={blog.id} 
                  blog={blog} 
                  currentPage={currentPage}
                  ref={(el) => {
                    if (el) {
                      blogCardRefs.current.set(blog.id, el);
                    } else {
                      blogCardRefs.current.delete(blog.id);
                    }
                  }}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default BlogList;

import { Link } from 'react-router-dom';
import { BlogCardProps } from '../lib/types';
import { useLanguage } from '../context/LanguageContext';
import { CalendarDays, Tag } from 'lucide-react';
import { forwardRef } from 'react';

const BlogCard = forwardRef<HTMLDivElement, BlogCardProps>(({ blog, currentPage }, ref) => { 
  const { t, language: currentLanguage } = useLanguage();

  const getLocalizedTitle = () => {
    if (currentLanguage === 'id') return blog.title_id;
    if (currentLanguage === 'ru') return blog.title_ru || blog.title_en;
    return blog.title_en;
  };

  const getLocalizedContentSnippet = () => {
    let content = '';
    if (currentLanguage === 'id') content = blog.content_id;
    else if (currentLanguage === 'ru') content = blog.content_ru || blog.content_en;
    else content = blog.content_en;

    const strippedContent = content.replace(/<[^>]*>?/gm, '');
    return strippedContent.length > 150 ? strippedContent.substring(0, 150) + '...' : strippedContent;
  };

  const formattedDate = new Date(blog.posting_date).toLocaleDateString(currentLanguage === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleCardClick = () => {
    sessionStorage.setItem('lastViewedBlogId', blog.id.toString());
    sessionStorage.setItem('lastViewedPage', currentPage.toString()); 
  };

  return (
    <div 
      ref={ref} 
      className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl"
    >
      <Link to={`/blogs/${blog.slug}`} className="block" onClick={handleCardClick}>
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={`${import.meta.env.VITE_BASE_URL}/storage/${blog.image}`}
            alt={getLocalizedTitle()}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
            {getLocalizedTitle()}
          </h2>
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
          <p className="text-gray-700 text-base mb-4 line-clamp-3">
            {getLocalizedContentSnippet()}
          </p>
          <span className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors">
            {t('readMore')} &rarr;
          </span>
        </div>
      </Link>
    </div>
  );
});

export default BlogCard;

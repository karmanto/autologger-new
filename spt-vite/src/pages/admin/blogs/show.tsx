import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBlogDetail, deleteBlog } from '../../../lib/api';
import { Blog } from '../../../lib/types';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorDisplay from '../../../components/ErrorDisplay';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaArrowLeft, FaCalendarAlt, FaTag } from 'react-icons/fa'; 

const ShowBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); 

  const fetchBlogDetail = useCallback(async () => {
    if (!id) {
      navigate('/admin/blogs');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const foundBlog = await getBlogDetail(id);
      setBlog(foundBlog);
    } catch (err) {
      console.error("Failed to fetch blog detail:", err);
      setError("Gagal memuat detail blog.");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchBlogDetail();
  }, [fetchBlogDetail]);

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm("Apakah Anda yakin ingin menghapus blog ini? Tindakan ini tidak dapat dibatalkan.")) {
      try {
        setLoading(true); 
        setError(null);
        setSuccess(null);
        await deleteBlog(parseInt(id));
        setSuccess("Blog berhasil dihapus!"); 
        toast.success("Blog berhasil dihapus!");
        navigate('/admin/blogs');
      } catch (err) {
        console.error("Failed to delete blog:", err);
        setError("Gagal menghapus blog."); 
        toast.error("Gagal menghapus blog.");
      } finally {
        setLoading(false); 
      }
    }
  };

  const renderBlogLanguageContentDisplay = (
    label: string,
    idContent: string | undefined,
    enContent: string | undefined,
    ruContent: string | undefined,
    isHtmlContent: boolean = false 
  ) => (
    <div className="mb-4 p-5 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
      <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500">Indonesian</label>
          <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
            {isHtmlContent ? (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: idContent || '<span class="text-gray-400 italic">Tidak ada</span>' }} />
            ) : (
              idContent || <span className="text-gray-400 italic">Tidak ada</span>
            )}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500">English</label>
          <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
            {isHtmlContent ? (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: enContent || '<span class="text-gray-400 italic">Tidak ada</span>' }} />
            ) : (
              enContent || <span className="text-gray-400 italic">Tidak ada</span>
            )}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500">Russian</label>
          <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
            {isHtmlContent ? (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: ruContent || '<span class="text-gray-400 italic">Tidak ada</span>' }} />
            ) : (
              ruContent || <span className="text-gray-400 italic">Tidak ada</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8 flex justify-center items-center">
        <ErrorDisplay message={error} onRetry={fetchBlogDetail} />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8 flex justify-center items-center">
        <p className="text-lg text-gray-600">Blog tidak ditemukan.</p>
      </div>
    );
  }

  const formattedDate = new Date(blog.posting_date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-0">
        <button
          type="button"
          onClick={() => navigate('/admin/blogs')}
          className="bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400 mb-2 flex items-center justify-center transition duration-300 ease-in-out shadow-md"
          title="Kembali ke Daftar Blog"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex-grow text-center sm:text-left">
            {blog.title_id || blog.title_en}
          </h1>

          <div className="flex space-x-3">
            <Link
              to={`/admin/blogs/edit/${blog.id}`}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center shadow-md"
              title="Edit Blog"
            >
              <FaEdit className="h-5 w-5 mr-2" /> Edit
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center shadow-md"
              title="Hapus Blog"
              disabled={loading}
            >
              <FaTrash className="h-5 w-5 mr-2" /> {loading ? 'Menghapus...' : 'Hapus'}
            </button>
          </div>
        </div>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6 shadow-md" role="alert">
            <strong className="font-bold">Berhasil!</strong>
            <span className="block sm:inline"> {success}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 shadow-md" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <div className="bg-white shadow-xl rounded-xl p-8 space-y-8">
          {/* Updated SEO Section to use localized display */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">SEO Metadata</h2>
            <div className="grid grid-cols-1 gap-6 mb-6">
              {renderBlogLanguageContentDisplay(
                'SEO Title',
                blog.seo_title_id,
                blog.seo_title_en,
                blog.seo_title_ru
              )}
              {renderBlogLanguageContentDisplay(
                'SEO Description',
                blog.seo_description_id,
                blog.seo_description_en,
                blog.seo_description_ru
              )}
            </div>
          </section>
          {/* End Updated SEO Section */}
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Informasi Umum</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Posting</label>
                <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                  <FaCalendarAlt className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{formattedDate}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                  <FaTag className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{blog.category ?? '-'}</span>
                </div>
              </div>
            </div>

            {renderBlogLanguageContentDisplay('Judul Blog', blog.title_id, blog.title_en, blog.title_ru)}
            {renderBlogLanguageContentDisplay('Konten Blog', blog.content_id, blog.content_en, blog.content_ru, true)}
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Gambar Blog</h2>
            <p className="text-sm text-gray-600 mb-4">Gambar utama yang terkait dengan blog ini.</p>
            {blog.image ? (
              <div className="relative group border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white">
                <img
                  src={`/storage/${blog.image}`}
                  alt={`Gambar Blog: ${blog.title_id}`}
                  className="w-full h-64 object-cover"
                />
                <div className="p-3 bg-gray-50 border-t border-gray-200">
                  <span className="block text-xs font-medium text-gray-600">Nama File: {blog.image.split('/').pop()}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 mb-6 bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-lg font-medium">Tidak ada gambar.</span>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShowBlog;

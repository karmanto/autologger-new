import { useParams, useNavigate } from 'react-router-dom';
import { getPromo, deletePromo } from '../../../lib/api';
import { Promo } from '../../../lib/types';
import { useState, useEffect, useCallback } from 'react';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';

export default function ShowPromo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [promo, setPromo] = useState<Promo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Promo ID is missing.');
      setLoading(false);
      return;
    }
    const fetchPromoDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPromo(id);
        setPromo(data);
      } catch (err) {
        console.error('Failed to fetch promo details:', err);
        setError('Gagal memuat detail promo.');
      } finally {
        setLoading(false);
      }
    };
    fetchPromoDetails();
  }, [id]);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    if (!window.confirm('Apakah Anda yakin ingin menghapus promo ini? Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await deletePromo(Number(id));
      setSuccess('Promo berhasil dihapus!');
      navigate('/admin/promos');
    } catch (err: any) {
      console.error('Failed to delete promo:', err);
      setError(err.message || 'Terjadi kesalahan saat menghapus promo.');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const renderPromoLanguageContentDisplay = (
    label: string,
    idContent: string | undefined,
    enContent: string | undefined,
    ruContent: string | undefined,
  ) => (
    <div className="mb-4 p-5 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
      <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500">Indonesian</label>
          <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
            {idContent || <span className="text-gray-400 italic">Tidak ada</span>}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500">English</label>
          <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
            {enContent || <span className="text-gray-400 italic">Tidak ada</span>}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500">Russian</label>
          <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
            {ruContent || <span className="text-gray-400 italic">Tidak ada</span>}
          </div>
        </div>
      </div>
    </div>
  );


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8 flex justify-center items-center">
        <p className="text-lg text-gray-600">Memuat detail promo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8 flex justify-center items-center">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  if (!promo) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8 flex justify-center items-center">
        <p className="text-lg text-gray-600">Promo tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-0">
        <button
          type="button"
          onClick={() => navigate('/admin/promos')}
          className="bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400 mb-2 flex items-center justify-center transition duration-300 ease-in-out shadow-md"
          title="Kembali ke Daftar Promo"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex-grow text-center sm:text-left">
            {promo.title_id || promo.title_en}
          </h1>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate(`/admin/promos/edit/${promo.id}`)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center shadow-md"
              title="Edit Promo"
            >
              <FaEdit className="h-5 w-5 mr-2" /> Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center shadow-md"
              title="Hapus Promo"
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
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Informasi Umum</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga 1</label>
                <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                  {promo.price}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga Lama 1 (opsional)</label>
                <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                  {promo.old_price ? <s className="text-red-500">{promo.old_price}</s> : <span className="text-gray-400 italic">Tidak ada</span>}
                </div>
              </div>
              {/* Display for price2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga 2 (opsional)</label>
                <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                  {promo.price2 || <span className="text-gray-400 italic">Tidak ada</span>}
                </div>
              </div>
              {/* Display for old_price2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga Lama 2 (opsional)</label>
                <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                  {promo.old_price2 ? <s className="text-red-500">{promo.old_price2}</s> : <span className="text-gray-400 italic">Tidak ada</span>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Berakhir</label>
                <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                  {new Date(promo.end_date).toLocaleDateString()}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL PDF</label>
                <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                  <a href={promo.pdf_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                    {promo.pdf_url}
                  </a>
                </div>
              </div>
            </div>

            {renderPromoLanguageContentDisplay('Judul Promo', promo.title_id, promo.title_en, promo.title_ru)}
            {renderPromoLanguageContentDisplay('Deskripsi Promo', promo.description_id, promo.description_en, promo.description_ru)}
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Gambar Promo</h2>
            <p className="text-sm text-gray-600 mb-4">Gambar utama yang terkait dengan promo ini.</p>
            {promo.image ? (
              <div className="relative group border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white">
                <img
                  src={`/storage/${promo.image}`}
                  alt={`Gambar Promo: ${promo.title_id}`}
                  className="w-full h-64 object-cover"
                />
                <div className="p-3 bg-gray-50 border-t border-gray-200">
                  <span className="block text-xs font-medium text-gray-600">Nama File: {promo.image.split('/').pop()}</span>
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
}

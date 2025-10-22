import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Promo } from '../../../lib/types';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPromos, deletePromo } from '../../../lib/api';
import { FaArrowLeft } from 'react-icons/fa';

export default function AdminPromos() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = useCallback(async () => {
    try {
      const data = await getPromos();
      setPromos(data);
    } catch (error) {
      console.error('Gagal mengambil promo:', error);
    }
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!window.confirm('Apakah Anda yakin ingin menghapus promo ini?')) return;
      try {
        await deletePromo(id);
        fetchPromos();
      } catch (error) {
        console.error('Gagal menghapus promo:', error);
      }
    },
    [fetchPromos]
  );

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Kelola Promo</h1>
          <Link
            to="/admin/promos/create"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center shadow-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Tambah Promo
          </Link>
        </div>
        
        {/* Tabel Promo */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gambar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Judul
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga 1
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga 2
                  </th> {/* New Header */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Berakhir
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500"> {/* colSpan changed to 6 */}
                      Tidak ada data promo
                    </td>
                  </tr>
                ) : (
                  promos.map((promo) => (
                    <tr key={promo.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {promo.image ? (
                          <img
                            src={`/storage/${promo.image}`}
                            alt={promo.title_id}
                            className="h-16 w-16 rounded object-cover"
                          />
                        ) : (
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{promo.title_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {promo.old_price ? (
                            <>
                              <span className="line-through text-gray-500 mr-2">
                                {promo.old_price}
                              </span>
                              <span className="font-bold text-red-600">{promo.price}</span>
                            </>
                          ) : (
                            <span className="font-bold">{promo.price}</span>
                          )}
                        </div>
                      </td>
                      {/* New TD for Harga 2 */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {promo.old_price2 ? (
                            <>
                              <span className="line-through text-gray-500 mr-2">
                                {promo.old_price2}
                              </span>
                              <span className="font-bold text-red-600">{promo.price2}</span>
                            </>
                          ) : (
                            <span className="font-bold">{promo.price2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {promo.end_date
                          ? new Date(
                              promo.end_date.replace(/\.(\d{3})\d+Z$/, '.$1Z')
                            ).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Link
                              to={`/admin/promos/${promo.id}`}
                              className="text-secondary hover:text-opacity-80 transition-colors duration-200"
                              title="Lihat Detail"
                            >
                              <Eye className="h-5 w-5" />
                            </Link>
                          <Link
                            to={`/admin/promos/edit/${promo.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(promo.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex space-x-4 mt-4"> 
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400 flex items-center justify-center transition duration-300 ease-in-out"
            title="Kembali ke Daftar Promo"
          >
            <FaArrowLeft className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}

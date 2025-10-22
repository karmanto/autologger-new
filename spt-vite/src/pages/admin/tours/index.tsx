import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TourPackage, TourPackageResponse } from '../../../lib/types';
import { Plus, Edit, Trash2, Eye, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTourPackages, deleteTourPackage, swapTourOrder } from '../../../lib/api';
import { FaArrowLeft } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'; 

export default function AdminTours() {
  const navigate = useNavigate();

  const [tours, setTours] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: TourPackageResponse = await getTourPackages({
        per_page: 9999,
        tour_type: 1,
      });
      setTours(data.data);
    } catch (err) {
      console.error('Gagal mengambil tur:', err);
      setError('Gagal memuat data tur. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!window.confirm('Apakah Anda yakin ingin menghapus tur ini?')) return;
      try {
        await deleteTourPackage(id);
        alert('Tur berhasil dihapus!');
        fetchTours();
      } catch (err) {
        console.error('Gagal menghapus tur:', err);
        setError('Gagal menghapus tur. Silakan coba lagi.');
      }
    },
    [fetchTours]
  );

  const onDragEnd = useCallback(async (result: DropResult) => {
    console.log('onDragEnd triggered', result);
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) {
      return;
    }

    const reorderedTours = Array.from(tours);
    const [removed] = reorderedTours.splice(sourceIndex, 1);
    reorderedTours.splice(destinationIndex, 0, removed);

    setTours(reorderedTours);

    const firstPackageId = tours[sourceIndex].id;
    const secondPackageId = tours[destinationIndex].id;

    try {
      await swapTourOrder(firstPackageId, secondPackageId);
      alert('Urutan tur berhasil diperbarui!');
      fetchTours();
    } catch (err) {
      console.error('Gagal memperbarui urutan tur:', err);
      setError('Gagal memperbarui urutan tur. Silakan coba lagi.');
      fetchTours(); 
    }
  }, [tours, fetchTours]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 text-center text-gray-600">
        Memuat data tur...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Kelola Tur</h1>
          <Link
            to="/admin/tours/create"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center shadow-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Tambah Tur
          </Link>
        </div>
        
        {/* Tabel Tur */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gambar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Tur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mulai Dari
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="tours-table-body">
                  {(provided) => (
                    <tbody
                      className="bg-white divide-y divide-gray-200"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {tours.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                            Tidak ada data tur
                          </td>
                        </tr>
                      ) : (
                        tours.map((tour, index) => (
                          <Draggable key={tour.id} draggableId={String(tour.id)} index={index}>
                            {(provided, snapshot) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`${snapshot.isDragging ? 'bg-blue-100' : ''}`}
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {tour.images && tour.images.length > 0 ? (
                                    <img
                                      src={`${tour.images[0].path}`} 
                                      alt={tour.name.id || tour.name.en}
                                      className="h-16 w-16 rounded object-cover"
                                    />
                                  ) : (
                                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm font-medium text-gray-900">{tour.name.id || tour.name.en}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{tour.location.id || tour.location.en}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {tour.starting_price ? (
                                    `${tour.currency || ''}${tour.starting_price.toLocaleString()}`
                                  ) : (
                                    `tidak ada`
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex justify-end space-x-3">
                                    <Link
                                        to={`/admin/tours/${tour.id}`}
                                        className="text-secondary hover:text-opacity-80 transition-colors duration-200"
                                        title="Lihat Detail"
                                      >
                                        <Eye className="h-5 w-5" />
                                      </Link>
                                    <Link
                                      to={`/admin/tours/edit/${tour.id}`}
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      <Edit className="h-5 w-5" />
                                    </Link>
                                    <Link
                                      to={`/admin/tours/create?copyFrom=${tour.id}`}
                                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                      title="Salin Tur"
                                    >
                                      <Copy className="h-5 w-5" />
                                    </Link>
                                    {/* Removed !tour.order condition to always show delete button */}
                                    <button
                                      onClick={() => handleDelete(tour.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <Trash2 className="h-5 w-5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              </DragDropContext>
            </table>
          </div>
        </div>

        <div className="flex space-x-4 mt-4"> 
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400 flex items-center justify-center transition duration-300 ease-in-out"
            title="Kembali ke Dashboard"
          >
            <FaArrowLeft className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}

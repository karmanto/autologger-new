import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Globe, Newspaper, Settings, BookOpen } from 'lucide-react'; 
import { getPromos, getTourPackages, getBlogs } from '../../lib/api'; 

export default function Dashboard() {
  const [dataCounts, setDataCounts] = useState({
    promos: 0,
    tours: 0,
    blogs: 0, 
    intlTours: 0,
    domesticTours: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promosResponse, toursResponse, blogsResponse, intlTourResponse, domesticTourResponse] = await Promise.all([ 
          getPromos(),
          getTourPackages({ per_page: 1, tour_type: 1 }), 
          getBlogs({ per_page: 1 }), 
          getTourPackages({ per_page: 1, tour_type: 3 }), 
          getTourPackages({ per_page: 1, tour_type: 2 }), 
        ]);

        setDataCounts({
          promos: promosResponse.length,
          tours: toursResponse.pagination.total,
          blogs: blogsResponse.pagination.total, 
          intlTours: intlTourResponse.pagination.total,
          domesticTours: domesticTourResponse.pagination.total,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const modules = [
    {
      title: 'Promo',
      icon: FileText,
      link: '/admin/promos',
      count: dataCounts.promos,
    },
    {
      title: 'Paket Tur', 
      icon: Globe, 
      link: '/admin/tours',
      count: dataCounts.tours,
    },
    {
      title: 'Paket Tur Internasional', 
      icon: Globe, 
      link: '/admin/international-tours',
      count: dataCounts.intlTours,
    },
    {
      title: 'Paket Tur Domestik', 
      icon: Globe, 
      link: '/admin/domestic-tours',
      count: dataCounts.domesticTours,
    },
    {
      title: 'Blog', 
      icon: BookOpen, // Changed to BookOpen for blog
      link: '/admin/blogs',
      count: dataCounts.blogs,
    },
    {
      title: 'Pengaturan SEO', // New module
      icon: Settings,
      link: '/admin/seo-settings',
      count: 'N/A', // SEO content doesn't have a count like other entities
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((module) => (
              <Link
                key={module.title}
                to={module.link}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <module.icon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {module.title}
                        </dt>
                        <dd className="flex items-baseline">
                          {/* Conditional rendering: only show count if it's not 'N/A' */}
                          {module.count !== 'N/A' && (
                            <div className="text-2xl font-semibold text-gray-900">
                              {module.count}
                            </div>
                          )}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

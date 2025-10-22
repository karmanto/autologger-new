import { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Login from './pages/Login';
// Removed: import CustomerLogin from './pages/CustomerLogin'; 
// Removed: import Profile from './pages/Profile'; 
import TourList from './pages/TourList';
import TourDetail from './pages/TourDetail';
import TourLayout from './layouts/TourLayout';
import BlogLayout from './layouts/BlogLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/admin/Dashboard';
import AdminPromos from './pages/admin/promos';
import CreatePromo from './pages/admin/promos/create';
import EditPromo from './pages/admin/promos/edit';
import ShowPromo from './pages/admin/promos/show';
import AdminTours from './pages/admin/tours';
import CreateTour from './pages/admin/tours/create';
import EditTour from './pages/admin/tours/edit';
import ShowTour from './pages/admin/tours/show';
import { setAuthErrorHandler } from './lib/auth';
import LoadingSpinner from './components/LoadingSpinner';
import { useLanguage } from './context/LanguageContext'; 
import { Language, PageSEO, SEOContent } from './lib/types';
import { getSEOContent } from './lib/api'; 
import { setMetaTag, setLinkTag, clearAllDynamicSEOTags } from './lib/seoUtils';

import IntlTourList from './pages/IntlTourList';
import IntlTourDetail from './pages/IntlTourDetail';
import IntlAdminTours from './pages/admin/intlTours';
import IntlCreateTour from './pages/admin/intlTours/create';
import IntlEditTour from './pages/admin/intlTours/edit';
import IntlShowTour from './pages/admin/intlTours/show';

import DomesticTourList from './pages/DomesticTourList';
import DomesticTourDetail from './pages/DomesticTourDetail';
import DomesticAdminTours from './pages/admin/domesticTours';
import DomesticCreateTour from './pages/admin/domesticTours/create';
import DomesticEditTour from './pages/admin/domesticTours/edit';
import DomesticShowTour from './pages/admin/domesticTours/show';

import SeoShow from './pages/admin/seo/show'; 
import SeoEdit from './pages/admin/seo/edit'; 

const BlogList = lazy(() => import('./pages/BlogList'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const AdminBlog = lazy(() => import('./pages/admin/blogs'));
const CreateBlog = lazy(() => import('./pages/admin/blogs/create'));
const EditBlog = lazy(() => import('./pages/admin/blogs/edit'));
const ShowBlog = lazy(() => import('./pages/admin/blogs/show'));

const LazyPromoSection = lazy(() => import('./components/PromoSection'));
const LazyTopPackages = lazy(() => import('./components/TopPackages'));

const LazyTestimonials = lazy(() => import('./components/Testimonials'));
const LazyAdvantages = lazy(() => import('./components/Advantages'));
const LazyAboutSection = lazy(() => import('./components/AboutSection'));
const LazyFAQ = lazy(() => import('./components/FAQ'));
const LazyGallery = lazy(() => import('./components/Gallery'));

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguageFromUrl, isLoading } = useLanguage(); 
  const [seoContentData, setSeoContentData] = useState<SEOContent | null>(null); 

  useEffect(() => {
    if (!isLoading && !seoContentData) { 
      const fetchSeo = async () => {
        try {
          const data = await getSEOContent();
          setSeoContentData(data);
        } catch (error) {
          console.error("Failed to fetch SEO content:", error);
        }
      };
      fetchSeo();
    }
  }, [isLoading, seoContentData]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const path = location.pathname;
    const pathSegments = path.split('/').filter(Boolean);
    const currentLangInUrl = pathSegments[0];
    const isPublicRoute = !path.startsWith('/admin') && !path.startsWith('/login');

    if (isPublicRoute) {
      if (['id', 'en', 'ru'].includes(currentLangInUrl)) {
        if (currentLangInUrl !== language) {
          setLanguageFromUrl(currentLangInUrl as Language);
        }
      } else {
        const targetPath = `/${language}${path === '/' ? '' : path}`;
        navigate(targetPath, { replace: true });
      }
    }
  }, [location.pathname, navigate, language, setLanguageFromUrl, isLoading]); 

  useEffect(() => {
    if (isLoading || !seoContentData) { 
      return;
    }

    const path = location.pathname;
    const pathSegments = path.split('/').filter(Boolean);
    const currentLangInUrl = pathSegments[0];
    const actualLanguage = ['id', 'en', 'ru'].includes(currentLangInUrl) ? currentLangInUrl : language;

    let pageKey: keyof SEOContent | null = null; 

    const isBlogListPage = path === `/${actualLanguage}/blogs` || path === '/blogs';
    const isIntlTourListPage = path === `/${actualLanguage}/international-tours` || path === '/international-tours';
    const isDomesticTourListPage = path === `/${actualLanguage}/domestic-tours` || path === '/domestic-tours';
    const isTourListPage = path === `/${actualLanguage}/tours` || path === '/tours';
    const isHomePage = path === `/${actualLanguage}` || path === '/';

    const isBlogDetailPage = path.match(/^\/(id|en|ru)?\/blogs\/[^/]+$/);
    const isIntlTourDetailPage = path.match(/^\/(id|en|ru)?\/international-tours\/[^/]+$/);
    const isDomesticTourDetailPage = path.match(/^\/(id|en|ru)?\/domestic-tours\/[^/]+$/);
    const isTourDetailPage = path.match(/^\/(id|en|ru)?\/tours\/[^/]+$/);

    if (isHomePage) {
      pageKey = 'home';
    } else if (isBlogListPage || isBlogDetailPage) { 
      pageKey = 'blogs';
    } else if (isIntlTourListPage || isIntlTourDetailPage) {
      pageKey = 'intlTours';
    } else if (isDomesticTourListPage || isDomesticTourDetailPage) {
      pageKey = 'domesticTours';
    } else if (isTourListPage || isTourDetailPage) {
      pageKey = 'tours';
    }

    const seoData: PageSEO | undefined = pageKey ? seoContentData[pageKey]?.[actualLanguage as Language] : undefined;

    clearAllDynamicSEOTags();

    if (seoData) {
      if (!isBlogDetailPage && !isIntlTourDetailPage && !isDomesticTourDetailPage && !isTourDetailPage) {
        document.title = seoData.title;
        setMetaTag('description', seoData.description);

        if (seoData.canonicalUrl) setLinkTag('canonical', seoData.canonicalUrl);
      }

      if (seoData.author) setMetaTag('author', seoData.author);
      if (seoData.robots) setMetaTag('robots', seoData.robots);
      
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(link => link.remove());
      const hreflangObj = seoData.hreflang ?? {};
      Object.entries(hreflangObj).forEach(([langCode, href]) => {
        if (typeof href === 'string' && href.trim() !== '') {
          const link = document.createElement('link');
          link.rel = 'alternate';
          link.hreflang = langCode;
          document.head.appendChild(link);
        }
      });
    } 
  }, [language, location.pathname, seoContentData, isLoading]); 

  useEffect(() => {
    setAuthErrorHandler(() => {
      navigate('/login', { replace: true });
    });
  }, [navigate]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  return (
      <div className="min-h-screen bg-white">
        <main role="main">
          <Routes>
            <Route path="/:lang?" element={
              <>
                <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
                <Hero />
                <Suspense fallback={<div className="flex justify-center items-center h-64 py-16 bg-gray-50"><LoadingSpinner /></div>}>
                  <LazyPromoSection />
                </Suspense>
                <Suspense fallback={<div className="flex justify-center items-center h-64 py-16 bg-white"><LoadingSpinner /></div>}>
                  <LazyTopPackages />
                </Suspense>
                <Suspense fallback={<div className="flex justify-center items-center h-64 py-16 bg-gray-50"><LoadingSpinner /></div>}>
                  <LazyTestimonials />
                </Suspense>
                <Suspense fallback={<div className="flex justify-center items-center h-64 py-16 bg-white"><LoadingSpinner /></div>}>
                  <LazyAdvantages />
                </Suspense>
                <Suspense fallback={<div className="flex justify-center items-center h-64 py-16 bg-gray-50"><LoadingSpinner /></div>}>
                  <LazyAboutSection />
                </Suspense>
                <Suspense fallback={<div className="flex justify-center items-center h-64 py-16 bg-white"><LoadingSpinner /></div>}>
                  <LazyGallery />
                </Suspense>
                <Suspense fallback={<div className="flex justify-center items-center h-64 py-16 bg-white"><LoadingSpinner /></div>}>
                  <LazyFAQ />
                </Suspense>
                <Footer />
                <WhatsAppButton />
              </>
            } />

            {/* REMOVED: Customer Auth Routes (Login and Profile are now handled by Header components) */}

            <Route element={<TourLayout />}>
              <Route path="/:lang?/tours" element={<TourList />} />
              <Route path="/:lang?/tours/:slug" element={<TourDetail />} />
            </Route>

            <Route element={<TourLayout />}>
              <Route path="/:lang?/international-tours" element={<IntlTourList />} />
              <Route path="/:lang?/international-tours/:slug" element={<IntlTourDetail />} />
            </Route>

            <Route element={<TourLayout />}>
              <Route path="/:lang?/domestic-tours" element={<DomesticTourList />} />
              <Route path="/:lang?/domestic-tours/:slug" element={<DomesticTourDetail />} />
            </Route>

            <Route element={<BlogLayout />}>
              <Route path="/:lang?/blogs" element={<BlogList />} />
              <Route path="/:lang?/blogs/:slug" element={<BlogDetail />} />
            </Route>

            {/* Admin Routes (no language prefix) */}
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
            </Route>
            <Route
              path="/admin/promos"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminPromos />} />
              <Route path="create" element={<CreatePromo />} />
              <Route path="edit/:id" element={<EditPromo />} />
              <Route path=":id" element={<ShowPromo />} />
            </Route>
            <Route
              path="/admin/tours"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminTours />} />
              <Route path="create" element={<CreateTour />} />
              <Route path="edit/:id" element={<EditTour />} />
              <Route path=":id" element={<ShowTour />} />
            </Route>
            <Route
              path="/admin/international-tours"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<IntlAdminTours />} />
              <Route path="create" element={<IntlCreateTour />} />
              <Route path="edit/:id" element={<IntlEditTour />} />
              <Route path=":id" element={<IntlShowTour />} />
            </Route>
            <Route
              path="/admin/domestic-tours"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DomesticAdminTours />} />
              <Route path="create" element={<DomesticCreateTour />} />
              <Route path="edit/:id" element={<DomesticEditTour />} />
              <Route path=":id" element={<DomesticShowTour />} />
            </Route>
            <Route
              path="/admin/blogs"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminBlog />} />
              <Route path="create" element={<CreateBlog />} />
              <Route path="edit/:id" element={<EditBlog />} />
              <Route path=":id" element={<ShowBlog />} />
            </Route>
            <Route
              path="/admin/seo-settings" 
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<SeoShow />} /> 
              <Route path="edit" element={<SeoEdit />} /> 
            </Route>
          </Routes>
        </main>
      </div>
  );
}

export default App;

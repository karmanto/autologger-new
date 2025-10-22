import {  Promo, 
          PromoCreatePayload, 
          TourPackage, 
          TourPackageResponse, 
          TourPackageCreatePayload, 
          TourPackageUpdatePayload, 
          LanguageContent, 
          Blog, 
          BlogCreatePayload, 
          BlogUpdatePayload, 
          BlogResponse, 
          Language, 
          SEOContent 
        } from './types';
import { handleAuthError } from './auth'; 
import { slugify } from './utils'; 

const API_URL = import.meta.env.VITE_API_URL;
interface FetchOptions extends RequestInit {
  body?: string;
}

const safeJSONParse = <T>(jsonString: string | T): T | string => {
  if (typeof jsonString === 'string') {
    try {
      return JSON.parse(jsonString) as T;
    } catch (e) {
      console.warn("Failed to parse JSON string:", jsonString, e);
      return jsonString; 
    }
  }
  return jsonString; 
};

// Helper to get the current language from localStorage
const getCurrentLanguage = (): Language => {
  const storedLang = localStorage.getItem('userLanguage');
  if (storedLang === 'id' || storedLang === 'en' || storedLang === 'ru') {
    return storedLang;
  }
  return 'en'; // Default to 'en' if not found or invalid
};

// Helper to get the correct title based on LanguageContent and active language
const getLocalizedTitle = (content: LanguageContent, lang: Language): string => {
  if (lang === 'id' && content.id) return content.id;
  if (lang === 'ru' && content.ru) return content.ru;
  return content.en; // Fallback to English
};

// Helper to get the correct blog title based on Blog object and active language
const getLocalizedBlogTitle = (blog: Blog, lang: Language): string => {
  if (lang === 'id') return blog.title_id;
  if (lang === 'ru') return blog.title_ru;
  return blog.title_en; // Fallback to English
};

const parseTourPackageData = (tour: TourPackage): TourPackage => {
  const parsedTour = { ...tour };
  const currentLang = getCurrentLanguage(); // Get language here

  parsedTour.name = safeJSONParse<LanguageContent>(tour.name) as LanguageContent;
  parsedTour.duration = safeJSONParse<LanguageContent>(tour.duration) as LanguageContent;
  parsedTour.location = safeJSONParse<LanguageContent>(tour.location) as LanguageContent;
  parsedTour.overview = safeJSONParse<LanguageContent>(tour.overview) as LanguageContent;
  // Removed generic seo_title and seo_description parsing
  // parsedTour.seo_title = tour.seo_title; 
  // parsedTour.seo_description = tour.seo_description; 

  parsedTour.prices = tour.prices.map(p => ({
    ...p,
    service_type: safeJSONParse<LanguageContent>(p.service_type) as LanguageContent,
    description: safeJSONParse<LanguageContent>(p.description) as LanguageContent,
  }));

  parsedTour.highlights = tour.highlights.map(h => ({
    ...h,
    description: safeJSONParse<LanguageContent>(h.description) as LanguageContent
  }));

  parsedTour.itineraries = tour.itineraries.map(it => ({
    ...it,
    title: safeJSONParse<LanguageContent>(it.title) as LanguageContent,
    activities: it.activities.map(act => ({
      ...act,
      description: safeJSONParse<LanguageContent>(act.description) as LanguageContent
    })),
    meals: it.meals.map(meal => ({
      ...meal,
      description: safeJSONParse<LanguageContent>(meal.description) as LanguageContent
    }))
  }));

  parsedTour.included_excluded = tour.included_excluded.map(ie => ({
    ...ie,
    description: safeJSONParse<LanguageContent>(ie.description) as LanguageContent
  }));

  parsedTour.faqs = tour.faqs.map(faq => ({
    ...faq,
    question: safeJSONParse<LanguageContent>(faq.question) as LanguageContent,
    answer: safeJSONParse<LanguageContent>(faq.answer) as LanguageContent
  }));

  parsedTour.cancellation_policies = tour.cancellation_policies.map(cp => ({
    ...cp,
    description: safeJSONParse<LanguageContent>(cp.description) as LanguageContent
  }));

  // Use the localized title for slugification
  const localizedName = getLocalizedTitle(parsedTour.name, currentLang);
  parsedTour.slug = `${slugify(localizedName)}-${tour.id}`;

  return parsedTour;
};

const parseBlogData = (blog: Blog): Blog => {
  const parsedBlog = { ...blog };
  const currentLang = getCurrentLanguage(); // Get language here
  
  // Removed generic seo_title and seo_description parsing
  // parsedBlog.seo_title = blog.seo_title;
  // parsedBlog.seo_description = blog.seo_description;

  // Use the localized title for slugification
  const localizedTitle = getLocalizedBlogTitle(parsedBlog, currentLang);
  parsedBlog.slug = `${slugify(localizedTitle)}-${blog.id}`;

  return parsedBlog;
};

export const fetchData = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token'); 
  if (token) { 
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/${endpoint}`, {
    headers,
    ...options
  });

  if (!response.ok) {
    if (response.status === 401) { 
      handleAuthError();
      throw new Error('Unauthorized: Token expired or invalid.'); 
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    } else {
      const errorText = await response.text();
      throw new Error(`API error: ${response.statusText}. Response: ${errorText.substring(0, 200)}...`);
    }
  }

  const contentType = response.headers.get("content-type");
  if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
    return null as T; 
  }

  return response.json();
};

export const fetchMultipartData = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const headers: HeadersInit = {};
  const token = localStorage.getItem('token'); 
  if (token) { 
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/${endpoint}`, {
    headers,
    ...options
  });

  if (!response.ok) {
    if (response.status === 401) { 
      handleAuthError();
      throw new Error('Unauthorized: Token expired or invalid.'); 
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    } else {
      const errorText = await response.text();
      throw new Error(`API error: ${response.statusText}. Response: ${errorText.substring(0, 200)}...`);
    }
  }

  const contentType = response.headers.get("content-type");
  if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
    return null as T; 
  }

  return response.json();
};

// ==== API Promo ====
export const getPromos = async () => fetchData<Promo[]>('promos');
export const getPromo = async (id: string) => fetchData<Promo>(`promos/${id}`);

export const addPromo = async (promo: PromoCreatePayload) => { 
  const formData = new FormData();
  formData.append('title_id', promo.title_id);
  formData.append('title_en', promo.title_en);
  formData.append('title_ru', promo.title_ru);
  formData.append('description_id', promo.description_id);
  formData.append('description_en', promo.description_en);
  formData.append('description_ru', promo.description_ru);
  formData.append('price', promo.price);
  if (promo.old_price) {
    formData.append('old_price', promo.old_price);
  }
  // Add price2 and old_price2
  if (promo.price2) {
    formData.append('price2', promo.price2);
  }
  if (promo.old_price2) {
    formData.append('old_price2', promo.old_price2);
  }
  formData.append('end_date', promo.end_date);
  formData.append('pdf_url', promo.pdf_url);
  if (promo.image) {
    formData.append('image', promo.image);
  }
  return fetchMultipartData<Promo>('promos', { method: 'POST', body: formData });
};

export const updatePromo = async (
  id: number,
  promo: Partial<Omit<Promo, 'id' | 'image'>> & { image?: File }) => {
  const formData = new FormData();

  if (promo.title_id)       formData.append('title_id', promo.title_id);
  if (promo.title_en)       formData.append('title_en', promo.title_en);
  if (promo.title_ru)       formData.append('title_ru', promo.title_ru);
  if (promo.description_id) formData.append('description_id', promo.description_id);
  if (promo.description_en) formData.append('description_en', promo.description_en);
  if (promo.description_ru) formData.append('description_ru', promo.description_ru);
  if (promo.price)         formData.append('price', promo.price);
  if (promo.old_price)      formData.append('old_price', promo.old_price);
  // Add price2 and old_price2
  if (promo.price2)         formData.append('price2', promo.price2);
  if (promo.old_price2)      formData.append('old_price2', promo.old_price2);
  if (promo.end_date) formData.append('end_date', promo.end_date);
  if (promo.pdf_url)  formData.append('pdf_url', promo.pdf_url);
  if (promo.image) {
    formData.append('image', promo.image);
  }

  formData.append('_method', 'PUT');

  return fetchMultipartData<Promo>(`promos/${id}`, {
    method: 'POST',
    body: formData,
  });
};

export const deletePromo = async (id: number) =>
  fetchData<void>(`promos/${id}`, { method: 'DELETE' });

// ==== API Tour Packages ====
export const getTourPackages = async (params?: { per_page?: number; page?: number; min_rate?: number; search?: string; tags?: string; tour_type: number}) => {
  const query = new URLSearchParams();
  if (params?.tour_type) query.append('tour_type', params.tour_type.toString());
  if (params?.per_page) query.append('per_page', params.per_page.toString());
  if (params?.page) query.append('page', params.page.toString());
  if (params?.min_rate) query.append('min_rate', params.min_rate.toString());
  if (params?.search) query.append('search', params.search); 
  if (params?.tags && params.tags !== 'all') { 
    query.append('tags', params.tags === 'other' ? 'private_service' : params.tags); 
  }

  const queryString = query.toString();
  const endpoint = `packages${queryString ? `?${queryString}` : ''}`;
  const response = await fetchData<TourPackageResponse>(endpoint);
  response.data = response.data.map(parseTourPackageData);
  return response;
};

export const getTourPackageDetail = async (id: string) => {
  const tour = await fetchData<TourPackage>(`packages/${id}`);
  return parseTourPackageData(tour);
};

export const addTourPackage = async (tour: TourPackageCreatePayload) => {
  const payloadToSend = {
    ...tour,
    name: JSON.stringify(tour.name),
    tour_type: tour.tour_type,
    duration: JSON.stringify(tour.duration),
    location: JSON.stringify(tour.location),
    prices: tour.prices.map(p => ({
      service_type: JSON.stringify(p.service_type),
      price: p.price,
      description: JSON.stringify(p.description),
    })),
    starting_price: tour.starting_price, 
    original_price: tour.original_price,
    currency: tour.currency,
    rate: tour.rate,
    overview: JSON.stringify(tour.overview),
    highlights: tour.highlights.map(h => ({
      description: JSON.stringify(h.description)
    })),
    itineraries: tour.itineraries.map(it => ({
      day: it.day,
      title: JSON.stringify(it.title),
      activities: it.activities.map(act => ({
        time: act.time,
        description: JSON.stringify(act.description)
      })),
      meals: it.meals.map(meal => ({
        description: JSON.stringify(meal.description)
      })),
    })),
    included_excluded: tour.included_excluded.map(ie => ({
      type: ie.type,
      description: JSON.stringify(ie.description)
    })),
    faqs: tour.faqs.map(faq => ({
      question: JSON.stringify(faq.question),
      answer: JSON.stringify(faq.answer)
    })),
    cancellation_policies: tour.cancellation_policies.map(cp => ({
      description: JSON.stringify(cp.description)
    })),
    // Corrected: Localized SEO fields
    seo_title_id: tour.seo_title_id || '',
    seo_description_id: tour.seo_description_id || '',
    seo_title_en: tour.seo_title_en || '',
    seo_description_en: tour.seo_description_en || '',
    seo_title_ru: tour.seo_title_ru || '',
    seo_description_ru: tour.seo_description_ru || '',
  };

  return fetchData<TourPackage>('packages', {
    method: 'POST',
    body: JSON.stringify(payloadToSend),
  });
};

export const updateTourPackage = async (id: number, tour: TourPackageUpdatePayload) => {
  const payloadToSend = {
    ...tour,
    ...(tour.name && { name: JSON.stringify(tour.name) }),
    ...(tour.duration && { duration: JSON.stringify(tour.duration) }),
    ...(tour.location && { location: JSON.stringify(tour.location) }),
    ...(tour.prices && { prices: tour.prices.map(p => ({
      service_type: JSON.stringify(p.service_type),
      price: p.price,
      description: JSON.stringify(p.description),
    })) }),
    ...(tour.starting_price !== undefined && { starting_price: tour.starting_price }), 
    ...(tour.original_price !== undefined && { original_price: tour.original_price }),
    ...(tour.currency !== undefined && { currency: tour.currency }),
    ...(tour.rate !== undefined && { rate: tour.rate }),
    ...(tour.overview && { overview: JSON.stringify(tour.overview) }),
    ...(tour.highlights && { highlights: tour.highlights.map(h => ({
      description: JSON.stringify(h.description)
    })) }),
    ...(tour.itineraries && { itineraries: tour.itineraries.map(it => ({
      day: it.day,
      title: JSON.stringify(it.title),
      activities: it.activities.map(act => ({
        time: act.time,
        description: JSON.stringify(act.description)
      })),
      meals: it.meals.map(meal => ({
        description: JSON.stringify(meal.description)
      })),
    })) }),
    ...(tour.included_excluded && { included_excluded: tour.included_excluded.map(ie => ({
      type: ie.type,
      description: JSON.stringify(ie.description)
    })) }),
    ...(tour.faqs && { faqs: tour.faqs.map(faq => ({
      question: JSON.stringify(faq.question),
      answer: JSON.stringify(faq.answer)
    })) }),
    ...(tour.cancellation_policies && { cancellation_policies: tour.cancellation_policies.map(cp => ({
      description: JSON.stringify(cp.description)
    })) }),
    // Corrected: Localized SEO fields
    ...(tour.seo_title_id !== undefined && { seo_title_id: tour.seo_title_id || '' }),
    ...(tour.seo_description_id !== undefined && { seo_description_id: tour.seo_description_id || '' }),
    ...(tour.seo_title_en !== undefined && { seo_title_en: tour.seo_title_en || '' }),
    ...(tour.seo_description_en !== undefined && { seo_description_en: tour.seo_description_en || '' }),
    ...(tour.seo_title_ru !== undefined && { seo_title_ru: tour.seo_title_ru || '' }),
    ...(tour.seo_description_ru !== undefined && { seo_description_ru: tour.seo_description_ru || '' }),
  };

  return fetchData<TourPackage>(`packages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payloadToSend),
  });
};

export const deleteTourPackage = async (id: number) => {
  return fetchData<void>(`packages/${id}`, {
    method: 'DELETE',
  });
};

export const uploadTourImage = async (imageFile: File): Promise<{ path: string; full_url: string }> => {
  const formData = new FormData();
  formData.append('image', imageFile);
  return fetchMultipartData<{ path: string; full_url: string }>('packages/upload-image', {
    method: 'POST',
    body: formData,
  });
};

export const swapTourOrder = async (firstPackageId: number, secondPackageId: number) => {
  return fetchData<void>(`packages/swap-order`, {
    method: 'POST',
    body: JSON.stringify({
      first_package_id: firstPackageId,
      second_package_id: secondPackageId,
    }),
  });
};

// ==== API Blog ====
export const getBlogs = async (params?: { per_page?: number; page?: number; search?: string; category?: string;}) => {
  const query = new URLSearchParams();
  if (params?.per_page) query.append('per_page', params.per_page.toString());
  if (params?.page) query.append('page', params.page.toString());
  if (params?.search) query.append('search', params.search); 
  if (params?.category) query.append('category', params.category); 

  const queryString = query.toString();
  const endpoint = `blogs${queryString ? `?${queryString}` : ''}`;
  const response = await fetchData<BlogResponse>(endpoint);
  response.data = response.data.map(parseBlogData);
  return response;
};

export const getBlogDetail = async (id: string) => {
  const blog = await fetchData<Blog>(`blogs/${id}`);
  return parseBlogData(blog);
};

export const addBlog = async (blog: BlogCreatePayload) => {
  const formData = new FormData();
  formData.append('title_id', blog.title_id);
  formData.append('title_en', blog.title_en);
  formData.append('title_ru', blog.title_ru);
  formData.append('content_id', blog.content_id);
  formData.append('content_en', blog.content_en);
  formData.append('content_ru', blog.content_ru);
  formData.append('posting_date', blog.posting_date);
  formData.append('category', blog.category);
  if (blog.image) {
    formData.append('image', blog.image);
  }
  // Corrected: Append localized SEO fields
  formData.append('seo_title_id', blog.seo_title_id || '');
  formData.append('seo_description_id', blog.seo_description_id || '');
  formData.append('seo_title_en', blog.seo_title_en || '');
  formData.append('seo_description_en', blog.seo_description_en || '');
  formData.append('seo_title_ru', blog.seo_title_ru || '');
  formData.append('seo_description_ru', blog.seo_description_ru || '');
  return fetchMultipartData<Blog>('blogs', { method: 'POST', body: formData });
};

export const updateBlog = async (id: number, blog: BlogUpdatePayload) => {
  const formData = new FormData();

  if (blog.title_id) formData.append('title_id', blog.title_id);
  if (blog.title_en) formData.append('title_en', blog.title_en);
  if (blog.title_ru) formData.append('title_ru', blog.title_ru);
  if (blog.content_id) formData.append('content_id', blog.content_id);
  if (blog.content_en) formData.append('content_en', blog.content_en);
  if (blog.content_ru) formData.append('content_ru', blog.content_ru);
  if (blog.posting_date) formData.append('posting_date', blog.posting_date);
  if (blog.category) formData.append('category', blog.category);
  if (blog.image) {
    formData.append('image', blog.image);
  }
  // Corrected: Append localized SEO fields
  if (blog.seo_title_id !== undefined) formData.append('seo_title_id', blog.seo_title_id || '');
  if (blog.seo_description_id !== undefined) formData.append('seo_description_id', blog.seo_description_id || '');
  if (blog.seo_title_en !== undefined) formData.append('seo_title_en', blog.seo_title_en || '');
  if (blog.seo_description_en !== undefined) formData.append('seo_description_en', blog.seo_description_en || '');
  if (blog.seo_title_ru !== undefined) formData.append('seo_title_ru', blog.seo_title_ru || '');
  if (blog.seo_description_ru !== undefined) formData.append('seo_description_ru', blog.seo_description_ru || '');

  formData.append('_method', 'PUT');

  return fetchMultipartData<Blog>(`blogs/${id}`, {
    method: 'POST', 
    body: formData,
  });
};

export const deleteBlog = async (id: number) =>
  fetchData<void>(`blogs/${id}`, { method: 'DELETE' });

// ==== API SEO Content ====
export const getSEOContent = async () => fetchData<SEOContent>('seo-content');

export const updateSEOContent = async (content: SEOContent) => {
  return fetchData<void>('seo-content', {
    method: 'PUT',
    body: JSON.stringify(content),
  });
};

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.substring(1); 
      console.log(`[ScrollToTop] Attempting to scroll to ID: ${id}`);

      const scrollTimeout = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          console.log(`[ScrollToTop] Element with ID "${id}" found. Scrolling...`);
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.warn(`[ScrollToTop] Element with ID "${id}" not found after 1000ms. Make sure the element exists and has the correct ID.`);
        }
      }, 1000);

      return () => clearTimeout(scrollTimeout);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]); 

  return null;
};

export default ScrollToTop;

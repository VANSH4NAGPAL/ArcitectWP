import { useState, useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useLayoutEffect(() => {
    // Show loader immediately on route change (before DOM updates)
    setIsLoading(true);
  }, [location.pathname]);

  useEffect(() => {
    // Set loading to false after 2.7 seconds (starts exit animation)
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2700);

    return () => {
      clearTimeout(loadingTimer);
    };
  }, [location.pathname]);

  return { isLoading };
};
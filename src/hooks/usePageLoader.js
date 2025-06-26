import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const hasLoadedOnce = useRef(false);

  useEffect(() => {
    if (!hasLoadedOnce.current) {
      setIsLoading(true);
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
        hasLoadedOnce.current = true;
      }, 2700);
      return () => clearTimeout(loadingTimer);
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  return { isLoading };
};
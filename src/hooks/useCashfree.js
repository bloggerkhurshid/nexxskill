import { useEffect, useState } from 'react';

export const useCashfree = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (window.Cashfree) {
      setIsLoaded(true);
      return;
    }

    const existing = document.querySelector('script[src*="cashfree"]');
    if (existing) {
      existing.addEventListener('load', () => setIsLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => {
      console.warn('Cashfree SDK failed to load from CDN. Demo payment mode enabled.');
      setIsLoaded(true);
    };
    document.body.appendChild(script);
  }, []);

  return isLoaded;
};

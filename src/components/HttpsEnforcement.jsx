// HTTPS Enforcement Component
import { useEffect } from 'react';

const HttpsEnforcement = () => {
  useEffect(() => {
    // Only enforce HTTPS in production
    if (import.meta.env.PROD && location.protocol !== 'https:' && location.hostname !== 'localhost') {
      console.warn('Redirecting to HTTPS for security');
      location.replace(`https:${location.href.substring(location.protocol.length)}`);
    }

    // Set security headers via meta tags (basic client-side enforcement)
    const setSecurityMeta = () => {
      // Content Security Policy
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = "default-src 'self' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https: data:; connect-src 'self' https:;";
      document.head.appendChild(cspMeta);

      // Strict Transport Security (if HTTPS)
      if (location.protocol === 'https:') {
        const hstsMeta = document.createElement('meta');
        hstsMeta.httpEquiv = 'Strict-Transport-Security';
        hstsMeta.content = 'max-age=31536000; includeSubDomains';
        document.head.appendChild(hstsMeta);
      }

      // X-Content-Type-Options
      const noSniffMeta = document.createElement('meta');
      noSniffMeta.httpEquiv = 'X-Content-Type-Options';
      noSniffMeta.content = 'nosniff';
      document.head.appendChild(noSniffMeta);

      // X-Frame-Options
      const frameMeta = document.createElement('meta');
      frameMeta.httpEquiv = 'X-Frame-Options';
      frameMeta.content = 'DENY';
      document.head.appendChild(frameMeta);

      // Referrer Policy
      const referrerMeta = document.createElement('meta');
      referrerMeta.name = 'referrer';
      referrerMeta.content = 'strict-origin-when-cross-origin';
      document.head.appendChild(referrerMeta);
    };

    setSecurityMeta();
  }, []);

  return null; // This component doesn't render anything
};

export default HttpsEnforcement;

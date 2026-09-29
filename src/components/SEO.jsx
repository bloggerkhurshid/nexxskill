import { useEffect } from 'react';

const SITE_NAME = 'NexxSkill';
const DEFAULT_TITLE = 'NexxSkill | Enterprise System z Mainframe & Software Academy';
const DEFAULT_DESC = 'Master job-ready IBM System z Mainframe, COBOL, JCL, DB2, and corporate software engineering skills led by industry veteran Jahangir Alom Bakul (IBM & Societe Generale Alum).';
const DEFAULT_IMAGE = 'https://nexxskill.com/assets/hero_banner.png';
const BASE_URL = 'https://nexxskill.com';

function updateMetaTag(attribute, attrValue, content) {
  if (!content) return;
  let element = document.querySelector(`meta[${attribute}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

export function SEO({
  title,
  description = DEFAULT_DESC,
  keywords,
  canonical,
  ogType = 'website',
  ogImage = DEFAULT_IMAGE,
  schema
}) {
  useEffect(() => {
    // 1. Page Title
    const fullTitle = title ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`) : DEFAULT_TITLE;
    document.title = fullTitle;

    // 2. Primary Meta Tags
    updateMetaTag('name', 'title', fullTitle);
    updateMetaTag('name', 'description', description);
    if (keywords) {
      updateMetaTag('name', 'keywords', keywords);
    }
    updateMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 3. Canonical URL
    const canonicalUrl = canonical ? `${BASE_URL}${canonical.startsWith('/') ? canonical : `/${canonical}`}` : window.location.href;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 4. Open Graph Tags
    updateMetaTag('property', 'og:site_name', SITE_NAME);
    updateMetaTag('property', 'og:type', ogType);
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:title', fullTitle);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:image', ogImage);

    // 5. Twitter Card Tags
    updateMetaTag('property', 'twitter:card', 'summary_large_image');
    updateMetaTag('property', 'twitter:url', canonicalUrl);
    updateMetaTag('property', 'twitter:title', fullTitle);
    updateMetaTag('property', 'twitter:description', description);
    updateMetaTag('property', 'twitter:image', ogImage);

    // 6. Structured Data (JSON-LD)
    let scriptElement = document.getElementById('route-schema-jsonld');
    if (schema) {
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = 'route-schema-jsonld';
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.text = JSON.stringify(schema);
    } else if (scriptElement) {
      scriptElement.remove();
    }
  }, [title, description, keywords, canonical, ogType, ogImage, schema]);

  return null;
}

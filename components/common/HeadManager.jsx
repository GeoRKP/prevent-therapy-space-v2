"use client";

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function HeadManager({ namespace, pageKey = 'metadata' }) {
  const { t, i18n } = useTranslation(namespace);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const currentLang = i18n.language || 'el';

    // Update document title
    const title = t(`${pageKey}.title`);
    if (title && title !== `${pageKey}.title`) {
      document.title = title;
    }

    // Update meta description
    const description = t(`${pageKey}.description`);
    if (description && description !== `${pageKey}.description`) {
      updateMetaTag('name', 'description', description);
    }

    // Update meta keywords
    const keywords = t(`${pageKey}.keywords`);
    if (keywords && keywords !== `${pageKey}.keywords`) {
      updateMetaTag('name', 'keywords', keywords);
    }

    // Update Open Graph tags
    const ogTitle = t(`${pageKey}.ogTitle`) !== `${pageKey}.ogTitle`
      ? t(`${pageKey}.ogTitle`)
      : title;
    const ogDescription = t(`${pageKey}.ogDescription`) !== `${pageKey}.ogDescription`
      ? t(`${pageKey}.ogDescription`)
      : description;
    const ogImage = t(`${pageKey}.ogImage`);

    updateMetaTag('property', 'og:title', ogTitle);
    updateMetaTag('property', 'og:description', ogDescription);
    updateMetaTag('property', 'og:type', 'website');
    updateMetaTag('property', 'og:locale', getOgLocale(currentLang));

    if (ogImage && ogImage !== `${pageKey}.ogImage`) {
      updateMetaTag('property', 'og:image', window.location.origin + ogImage);
    }

    // Update Twitter Card tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', ogTitle);
    updateMetaTag('name', 'twitter:description', ogDescription);

    // Update canonical URL
    updateLinkTag('canonical', window.location.origin + window.location.pathname);

    // Update alternate language links
    updateAlternateLinks(window.location.pathname);

    // Update html lang attribute
    document.documentElement.lang = currentLang;

    // Update robots meta
    const robots = t(`${pageKey}.robots`);
    if (robots && robots !== `${pageKey}.robots`) {
      updateMetaTag('name', 'robots', robots);
    } else {
      updateMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    // Update author
    updateMetaTag('name', 'author', 'PREVENT Therapy Space');

    // Update viewport (ensure mobile optimization)
    updateMetaTag('name', 'viewport', 'width=device-width, initial-scale=1.0');

  }, [t, i18n.language, namespace, pageKey]);

  return null; // This component doesn't render anything
}

// Helper function to update or create meta tags
function updateMetaTag(attribute, key, content) {
  if (!content) return;

  let meta = document.querySelector(`meta[${attribute}="${key}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

// Helper function to update or create link tags
function updateLinkTag(rel, href) {
  if (!href) return;

  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
}

// Helper function to update alternate language links
function updateAlternateLinks(pathname) {
  // Remove existing alternate links
  const existingAlternates = document.querySelectorAll('link[rel="alternate"]');
  existingAlternates.forEach(link => link.remove());

  const languages = ['el', 'en'];
  const baseUrl = window.location.origin;

  languages.forEach(lang => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = lang;
    link.href = `${baseUrl}${pathname}`;
    document.head.appendChild(link);
  });

  // Add x-default
  const xDefault = document.createElement('link');
  xDefault.rel = 'alternate';
  xDefault.hreflang = 'x-default';
  xDefault.href = `${baseUrl}${pathname}`;
  document.head.appendChild(xDefault);
}

// Convert language code to Open Graph locale format
function getOgLocale(lang) {
  const localeMap = {
    'el': 'el_GR',
    'en': 'en_US',
  };
  return localeMap[lang] || 'el_GR';
}

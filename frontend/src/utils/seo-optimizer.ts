/**
 * Утилиты для SEO-оптимизации
 */

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  lang?: string;
}

/**
 * Генерация schema.org разметки
 */
export const generateSchemaMarkup = (data: {
  type: 'Organization' | 'WebSite' | 'Product' | 'Article' | 'LocalBusiness';
  name: string;
  url?: string;
  logo?: string;
  description?: string;
  [key: string]: any;
}): string => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': data.type,
    name: data.name,
  };

  if (data.url) schema.url = data.url;
  if (data.logo) schema.logo = data.logo;
  if (data.description) schema.description = data.description;

  // Добавляем дополнительные поля в зависимости от типа
  switch (data.type) {
    case 'Organization':
      if (data.sameAs) schema.sameAs = data.sameAs;
      if (data.contactPoint) schema.contactPoint = data.contactPoint;
      break;
    case 'WebSite':
      if (data.potentialAction) schema.potentialAction = data.potentialAction;
      break;
    case 'Product':
      if (data.brand) schema.brand = data.brand;
      if (data.offers) schema.offers = data.offers;
      break;
    case 'Article':
      if (data.author) schema.author = data.author;
      if (data.datePublished) schema.datePublished = data.datePublished;
      break;
    case 'LocalBusiness':
      if (data.address) schema.address = data.address;
      if (data.telephone) schema.telephone = data.telephone;
      break;
  }

  return JSON.stringify(schema);
};

/**
 * Обновление мета-тегов
 */
export const updateMetaTags = (seoData: SEOData): void => {
  // Title
  document.title = seoData.title;

  // Meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', seoData.description);

  // Keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (seoData.keywords.length > 0) {
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', seoData.keywords.join(', '));
  }

  // Open Graph
  if (seoData.ogTitle) {
    updateOrCreateMeta('property', 'og:title', seoData.ogTitle);
  }
  if (seoData.ogDescription) {
    updateOrCreateMeta('property', 'og:description', seoData.ogDescription);
  }
  if (seoData.ogImage) {
    updateOrCreateMeta('property', 'og:image', seoData.ogImage);
  }
  if (seoData.ogType) {
    updateOrCreateMeta('property', 'og:type', seoData.ogType);
  }

  // Twitter Card
  if (seoData.twitterCard) {
    updateOrCreateMeta('name', 'twitter:card', seoData.twitterCard);
  }

  // Canonical URL
  if (seoData.canonicalUrl) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', seoData.canonicalUrl);
  }

  // Language
  if (seoData.lang) {
    document.documentElement.lang = seoData.lang;
  }
};

const updateOrCreateMeta = (attribute: string, value: string, content: string): void => {
  let meta = document.querySelector(`meta[${attribute}="${value}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, value);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

/**
 * Генерация XML sitemap
 */
export const generateSitemap = (pages: Array<{ url: string; lastmod?: string; changefreq?: string; priority?: number }>): string => {
  const urls = pages.map((page) => {
    return `  <url>
    <loc>${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ''}
    ${page.priority !== undefined ? `<priority>${page.priority}</priority>` : ''}
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
};

/**
 * Генерация robots.txt
 */
export const generateRobotsTxt = (options: {
  allow?: string[];
  disallow?: string[];
  sitemap?: string;
  crawlDelay?: number;
}): string => {
  const lines: string[] = [];

  if (options.allow) {
    options.allow.forEach((path) => {
      lines.push(`Allow: ${path}`);
    });
  }

  if (options.disallow) {
    options.disallow.forEach((path) => {
      lines.push(`Disallow: ${path}`);
    });
  }

  if (options.crawlDelay) {
    lines.push(`Crawl-delay: ${options.crawlDelay}`);
  }

  if (options.sitemap) {
    lines.push(`Sitemap: ${options.sitemap}`);
  }

  return lines.join('\n');
};

/**
 * Анализ SEO страницы
 */
export const analyzeSEO = (): {
  score: number;
  issues: Array<{ type: 'error' | 'warning' | 'info'; message: string }>;
  suggestions: string[];
} => {
  const issues: Array<{ type: 'error' | 'warning' | 'info'; message: string }> = [];
  const suggestions: string[] = [];
  let score = 100;

  // Проверка title
  const title = document.querySelector('title');
  if (!title || !title.textContent || title.textContent.length < 30) {
    issues.push({ type: 'error', message: 'Title tag is missing or too short (should be 30-60 characters)' });
    score -= 10;
  } else if (title.textContent.length > 60) {
    issues.push({ type: 'warning', message: 'Title tag is too long (should be 30-60 characters)' });
    score -= 5;
  }

  // Проверка meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription || !metaDescription.getAttribute('content')) {
    issues.push({ type: 'error', message: 'Meta description is missing' });
    score -= 10;
  } else {
    const desc = metaDescription.getAttribute('content') || '';
    if (desc.length < 120) {
      issues.push({ type: 'warning', message: 'Meta description is too short (should be 120-160 characters)' });
      score -= 5;
    } else if (desc.length > 160) {
      issues.push({ type: 'warning', message: 'Meta description is too long (should be 120-160 characters)' });
      score -= 5;
    }
  }

  // Проверка заголовков
  const h1 = document.querySelectorAll('h1');
  if (h1.length === 0) {
    issues.push({ type: 'error', message: 'H1 tag is missing' });
    score -= 10;
  } else if (h1.length > 1) {
    issues.push({ type: 'warning', message: 'Multiple H1 tags found (should be only one)' });
    score -= 5;
  }

  // Проверка изображений без alt
  const images = document.querySelectorAll('img');
  let imagesWithoutAlt = 0;
  images.forEach((img) => {
    if (!img.getAttribute('alt')) {
      imagesWithoutAlt++;
    }
  });
  if (imagesWithoutAlt > 0) {
    issues.push({ type: 'warning', message: `${imagesWithoutAlt} image(s) without alt attribute` });
    score -= imagesWithoutAlt * 2;
  }

  // Проверка Open Graph
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    suggestions.push('Add Open Graph title for better social media sharing');
  }

  // Проверка canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    suggestions.push('Add canonical URL to avoid duplicate content issues');
  }

  return {
    score: Math.max(0, score),
    issues,
    suggestions,
  };
};


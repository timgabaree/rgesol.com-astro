import type { APIRoute } from 'astro';
export const GET: APIRoute = () => {
 const pages: Record<string,string[]>={
  '/':['rgesolutions-og-descriptive-1200x630.webp','signal-engineering-clarity-822x500.webp','signal-cloud-and-infrastructure-400x400.webp','signal-cybersecurity-and-risk-400x400.webp','signal-vendor-and-spend-control-400x400.webp','signal-ai-and-data-readiness-400x400.webp'],
  '/about':['profile-pic-tim-gabaree-900x1200.webp'], '/contact':[], '/privacy':[], '/sitemap':[]
 };
 return new Response('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'+
 Object.entries(pages).map(([route,images])=>`<url><loc>https://rgesol.com${route}</loc><lastmod>2026-10-28</lastmod>${images.map(file=>`<image:image><image:loc>https://rgesol.com/media/${file}</image:loc></image:image>`).join('')}</url>`).join('')+'</urlset>',
 {headers:{'Content-Type':'application/xml; charset=utf-8'}});
};

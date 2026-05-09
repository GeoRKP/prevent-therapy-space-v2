export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://preventtherapy.gr";

  const pages = [
    { url: "", priority: "1.0", changefreq: "weekly" },
    { url: "/services", priority: "0.9", changefreq: "monthly" },
    { url: "/about", priority: "0.8", changefreq: "monthly" },
    { url: "/contact", priority: "0.8", changefreq: "monthly" },
    { url: "/faq", priority: "0.7", changefreq: "monthly" },
    { url: "/booking", priority: "0.9", changefreq: "weekly" },
  ];

  const today = new Date().toISOString().split("T")[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="el" href="${baseUrl}${page.url}" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${page.url}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${page.url}" />
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

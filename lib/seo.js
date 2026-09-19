// Server-side metadata ανά σελίδα (Next.js Metadata API). Τα ελληνικά είναι η
// προεπιλεγμένη γλώσσα του SSR· ο HeadManager (client) ενημερώνει τα ίδια tags
// όταν ο επισκέπτης αλλάξει σε αγγλικά. Τα OG/Twitter tags γράφονται ολόκληρα
// σε κάθε σελίδα, γιατί το Next δεν κάνει deep-merge σε nested objects.
import { SITE_NAME, HOME_TITLE } from "@/lib/site";

export const OG_IMAGE = {
  url: "/images/og-image.jpg",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

export function pageMetadata({ title, description, path = "/", noindex = false }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : HOME_TITLE;

  const meta = {
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "el_GR",
      alternateLocale: ["en_US"],
      siteName: SITE_NAME,
      url: path,
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };

  if (title) meta.title = title;
  if (noindex) meta.robots = { index: false, follow: false };

  return meta;
}

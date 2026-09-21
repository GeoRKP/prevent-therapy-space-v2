import { pageMetadata } from "@/lib/seo";

// Κρυφή σελίδα δοκιμής παλέτας για τον πελάτη — εκτός ευρετηρίου και sitemap.
export const metadata = pageMetadata({
  title: "Δοκιμή παλέτας",
  description: "Τρία στιλ φόντου για την έκδοση κινητού.",
  path: "/palette",
  noindex: true,
});

export default function Layout({ children }) {
  return children;
}

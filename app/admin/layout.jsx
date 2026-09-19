import { pageMetadata } from "@/lib/seo";

// Server-side metadata της σελίδας (η ίδια η σελίδα είναι client component).
export const metadata = pageMetadata({
  title: "Διαχείριση",
  description:
    "Περιοχή διαχείρισης κρατήσεων του PREVENT Therapy Space.",
  path: "/admin",
  noindex: true,
});

export default function Layout({ children }) {
  return children;
}

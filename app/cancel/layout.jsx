import { pageMetadata } from "@/lib/seo";

// Server-side metadata της σελίδας (η ίδια η σελίδα είναι client component).
export const metadata = pageMetadata({
  title: "Ακύρωση Ραντεβού",
  description:
    "Ακυρώστε το ραντεβού σας στο PREVENT Therapy Space.",
  path: "/cancel",
  noindex: true,
});

export default function Layout({ children }) {
  return children;
}

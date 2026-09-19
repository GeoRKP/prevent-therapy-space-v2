import { pageMetadata } from "@/lib/seo";

// Server-side metadata της σελίδας (η ίδια η σελίδα είναι client component).
export const metadata = pageMetadata({
  title: "Σχετικά",
  description:
    "Γνωρίστε την ιστορία, την ομάδα και τη φιλοσοφία του PREVENT Therapy Space.",
  path: "/about",
});

export default function Layout({ children }) {
  return children;
}

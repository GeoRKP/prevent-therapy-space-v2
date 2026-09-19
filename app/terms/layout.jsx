import { pageMetadata } from "@/lib/seo";

// Server-side metadata της σελίδας (η ίδια η σελίδα είναι client component).
export const metadata = pageMetadata({
  title: "Όροι Χρήσης",
  description:
    "Όροι χρήσης του ιστότοπου και του συστήματος online κρατήσεων του PREVENT Therapy Space.",
  path: "/terms",
});

export default function Layout({ children }) {
  return children;
}

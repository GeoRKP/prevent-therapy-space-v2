import { pageMetadata } from "@/lib/seo";

// Server-side metadata της σελίδας (η ίδια η σελίδα είναι client component).
export const metadata = pageMetadata({
  title: "Πολιτική Απορρήτου",
  description:
    "Πώς το PREVENT Therapy Space συλλέγει, χρησιμοποιεί και προστατεύει τα προσωπικά σας δεδομένα.",
  path: "/privacy",
});

export default function Layout({ children }) {
  return children;
}

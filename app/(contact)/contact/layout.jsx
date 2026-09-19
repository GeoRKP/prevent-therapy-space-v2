import { pageMetadata } from "@/lib/seo";

// Server-side metadata της σελίδας (η ίδια η σελίδα είναι client component).
export const metadata = pageMetadata({
  title: "Επικοινωνία",
  description:
    "Επικοινωνήστε με το PREVENT Therapy Space στα Πατήσια — ραντεβού, ερωτήσεις, οδηγίες πρόσβασης.",
  path: "/contact",
});

export default function Layout({ children }) {
  return children;
}

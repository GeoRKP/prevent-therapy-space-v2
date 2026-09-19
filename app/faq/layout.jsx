import { pageMetadata } from "@/lib/seo";

// Server-side metadata της σελίδας (η ίδια η σελίδα είναι client component).
export const metadata = pageMetadata({
  title: "Συχνές Ερωτήσεις",
  description:
    "Απαντήσεις σε συχνές ερωτήσεις για τις υπηρεσίες, τα ραντεβού και τη θεραπευτική προσέγγιση.",
  path: "/faq",
});

export default function Layout({ children }) {
  return children;
}

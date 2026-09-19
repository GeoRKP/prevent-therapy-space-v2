import { pageMetadata } from "@/lib/seo";

// Server-side metadata της σελίδας (η ίδια η σελίδα είναι client component).
export const metadata = pageMetadata({
  title: "Κλείστε Ραντεβού",
  description:
    "Κλείστε online το ραντεβού σας στο PREVENT Therapy Space σε λίγα δευτερόλεπτα.",
  path: "/booking",
});

export default function Layout({ children }) {
  return children;
}

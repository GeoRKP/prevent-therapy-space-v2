import { pageMetadata } from "@/lib/seo";

// Server-side metadata της σελίδας (η ίδια η σελίδα είναι client component).
export const metadata = pageMetadata({
  title: "Η Υπηρεσία μας",
  description:
    "Φυσικοθεραπεία, οστεοπαθητική και θεραπευτική άσκηση — μία ολοκληρωμένη υπηρεσία, εξατομικευμένη σε κάθε συνεδρία.",
  path: "/services",
});

export default function Layout({ children }) {
  return children;
}

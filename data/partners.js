import { Stethoscope, Apple } from "lucide-react";

// Μόνο συνεργάτες με πραγματικό όνομα + φωτογραφία εμφανίζονται στο site.
// Οι θέσεις που εκκρεμούν (γυμνάστρια, οικογενειακή ιατρός) είναι
// καταγεγραμμένες στο ΕΚΚΡΕΜΟΤΗΤΕΣ.md — προστίθενται εδώ μόλις έρθουν στοιχεία.
export const partners = [
  {
    id: "tsitouridis",
    image: "/images/team/alexandros-tsitouridis.jpg",
    icon: Stethoscope,
  },
  {
    id: "nutritionist",
    image: "/images/team/eleni-kallianioti.jpg",
    icon: Apple,
  },
];

import { Stethoscope, Apple, Dumbbell } from "lucide-react";

// Μόνο συνεργάτες με πραγματικό όνομα + φωτογραφία εμφανίζονται στο site.
// Η θέση που εκκρεμεί (οικογενειακή ιατρός) είναι καταγεγραμμένη
// στο ΕΚΚΡΕΜΟΤΗΤΕΣ.md — προστίθεται εδώ μόλις έρθουν στοιχεία.
export const partners = [
  {
    id: "tsitouridis",
    image: "/images/team/alexandros-tsitouridis.jpg",
    icon: Stethoscope,
  },
  {
    id: "trainer",
    image: "/images/team/ioanna-demerouti.jpg",
    icon: Dumbbell,
  },
  {
    id: "nutritionist",
    image: "/images/team/eleni-kallianioti.jpg",
    icon: Apple,
  },
];

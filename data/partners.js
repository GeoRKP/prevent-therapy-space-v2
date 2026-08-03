import { Stethoscope, Dumbbell, Apple } from "lucide-react";

// Πρώτα οι συνεργάτες με πραγματικό πρόσωπο/όνομα, μετά οι role-first θέσεις.
// Όσοι δεν έχουν image εμφανίζονται ως κάρτες ρόλου (χωρίς ψεύτικο όνομα) —
// μόλις δοθούν όνομα + φωτογραφία, συμπληρώνεται το image και το όνομα στα locales.
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
  {
    id: "trainer",
    image: null,
    icon: Dumbbell,
  },
  {
    id: "doctor",
    image: null,
    icon: Stethoscope,
  },
];

import { Stethoscope, Dumbbell, Apple } from "lucide-react";

// Οι συνεργάτες χωρίς image εμφανίζονται με placeholder μέχρι να δοθούν
// ονόματα και φωτογραφίες από τον ιδιοκτήτη (τα ονόματα ζουν στα locale αρχεία).
export const partners = [
  {
    id: "tsitouridis",
    image: "/images/team/alexandros-tsitouridis.jpg",
    icon: Stethoscope,
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
  {
    id: "nutritionist",
    image: "/images/team/nutritionist.jpg",
    icon: Apple,
  },
];

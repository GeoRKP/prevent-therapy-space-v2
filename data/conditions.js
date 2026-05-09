import {
  Activity,
  Dumbbell,
  RotateCcw,
  HeartPulse,
  Bone,
  Clock,
  ArrowUpDown,
  Zap,
} from "lucide-react";

export const conditions = [
  { key: "backPain", icon: Activity },
  { key: "sportsInjuries", icon: Dumbbell },
  { key: "neckPain", icon: RotateCcw },
  { key: "postSurgery", icon: HeartPulse },
  { key: "jointPain", icon: Bone },
  { key: "chronicPain", icon: Clock },
  { key: "posture", icon: ArrowUpDown },
  { key: "sciatica", icon: Zap },
];

export const contactInfo = {
  phone: "210 123 4567",
  email: "info@preventtherapy.gr",
  address: {
    el: "Θεοτοκοπούλου 55, Πατήσια, Αθήνα",
    en: "Theotokopoulou 55, Patisia, Athens",
  },
};

"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import commonEL from "../public/locales/el/common.json";
import commonEN from "../public/locales/en/common.json";
import headerEL from "../public/locales/el/header.json";
import headerEN from "../public/locales/en/header.json";
import homeEL from "../public/locales/el/home.json";
import homeEN from "../public/locales/en/home.json";
import servicesEL from "../public/locales/el/services.json";
import servicesEN from "../public/locales/en/services.json";
import aboutEL from "../public/locales/el/about.json";
import aboutEN from "../public/locales/en/about.json";
import contactEL from "../public/locales/el/contact.json";
import contactEN from "../public/locales/en/contact.json";
import footerEL from "../public/locales/el/footer.json";
import footerEN from "../public/locales/en/footer.json";
import notfoundEL from "../public/locales/el/notfound.json";
import notfoundEN from "../public/locales/en/notfound.json";
import bookingEL from "../public/locales/el/booking.json";
import bookingEN from "../public/locales/en/booking.json";
import faqEL from "../public/locales/el/faq.json";
import faqEN from "../public/locales/en/faq.json";
import legalEL from "../public/locales/el/legal.json";
import legalEN from "../public/locales/en/legal.json";

const resources = {
  el: {
    common: commonEL,
    header: headerEL,
    home: homeEL,
    services: servicesEL,
    about: aboutEL,
    contact: contactEL,
    footer: footerEL,
    notfound: notfoundEL,
    booking: bookingEL,
    faq: faqEL,
    legal: legalEL,
  },
  en: {
    common: commonEN,
    header: headerEN,
    home: homeEN,
    services: servicesEN,
    about: aboutEN,
    contact: contactEN,
    footer: footerEN,
    notfound: notfoundEN,
    booking: bookingEN,
    faq: faqEN,
    legal: legalEN,
  },
};

// Η ανίχνευση γλώσσας γίνεται ΜΟΝΟ μετά το mount (components/common/LanguageDetector),
// ώστε server και client να κάνουν το πρώτο render πάντα στα ελληνικά — αλλιώς hydration mismatch.
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: "el",
      fallbackLng: "el",
      defaultNS: "common",
      ns: [
        "common",
        "header",
        "home",
        "services",
        "about",
        "contact",
        "footer",
        "notfound",
        "booking",
        "faq",
        "legal",
      ],
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
}

export default i18n;

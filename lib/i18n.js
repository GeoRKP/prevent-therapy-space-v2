"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

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
  },
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
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
      ],
      interpolation: { escapeValue: false },
      detection: {
        order: ["localStorage", "navigator"],
        lookupLocalStorage: "i18nextLng",
        caches: ["localStorage"],
      },
      react: { useSuspense: false },
    });
}

export default i18n;

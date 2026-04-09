import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en/translation.json";
import arTranslation from "./locales/ar/translation.json";
import frTranslation from "./locales/fr/translation.json";

const resources = {
  en: { translation: enTranslation },
  ar: { translation: arTranslation },
  fr: { translation: frTranslation },
};

const updateDocumentLanguage = (lng) => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.lang = lng;
  document.documentElement.dir = i18n.dir(lng);
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ["en", "ar", "fr"],
    fallbackLng: "fr",
    lng: "fr",
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

updateDocumentLanguage(i18n.resolvedLanguage || i18n.language || "fr");
i18n.on("languageChanged", updateDocumentLanguage);

export default i18n;

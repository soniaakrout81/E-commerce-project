import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import MetaTags from "../components/MetaTags";
import "../pageStyles/StaticPages.css";

function About() {
  const { settings } = useSelector((state) => state.settings);
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <PageTitle title={t("template.static.about")} />
      <MetaTags
        title={`${t("template.static.about")} | ${settings?.storeName || "Store"}`}
        description={settings?.footerAbout || settings?.tagline}
        keywords="about us, brand, store"
      />

      <main className="static-page-shell">
        <section className="static-page-card">
          <p className="static-kicker">{t("template.static.about")}</p>
          <h1>{settings?.storeName || t("template.static.ourStore")}</h1>
          <p>{settings?.footerAbout || "This store is built to deliver a premium branded shopping experience with reusable storefront sections and a polished admin workflow."}</p>
          <p>{settings?.tagline || "Premium products curated for modern shoppers."}</p>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default About;

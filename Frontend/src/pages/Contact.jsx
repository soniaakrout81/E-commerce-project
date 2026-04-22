import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import MetaTags from "../components/MetaTags";
import "../pageStyles/StaticPages.css";

function Contact() {
  const { settings } = useSelector((state) => state.settings);
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <PageTitle title={t("navbar.contactUs")} />
      <MetaTags
        title={`${t("navbar.contactUs")} | ${settings?.storeName || "Store"}`}
        description={settings?.newsletterText || settings?.tagline}
        keywords="contact, support, email, phone"
      />

      <main className="static-page-shell">
        <section className="static-page-card">
          <p className="static-kicker">{t("template.home.contactLabel")}</p>
          <h1>{t("template.static.getInTouch")}</h1>
          <div className="static-contact-grid">
            <article>
              <strong>{t("footer.email")}</strong>
              <p>{settings?.contactEmail || "hello@example.com"}</p>
            </article>
            <article>
              <strong>{t("footer.phone")}</strong>
              <p>{settings?.contactPhone || "+000 000 000"}</p>
            </article>
            <article>
              <strong>{t("template.settings.address")}</strong>
              <p>{settings?.address || t("template.static.storeAddress")}</p>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Contact;

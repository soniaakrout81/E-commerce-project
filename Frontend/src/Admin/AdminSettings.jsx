import React, { useEffect, useState } from "react";
import { Palette, Storefront, ContactMail, Save, Description } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import AdminSidebar from "../components/AdminSidebar";
import { clearSettingsError, fetchSiteSettings, updateSiteSettings } from "../features/settings/siteSettingsSlice";
import "../AdminStyles/AdminSettings.css";

const toDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

function AdminSettings() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { settings, loading, saving, error } = useSelector((state) => state.settings);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    dispatch(fetchSiteSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.storeName || "",
        tagline: settings.tagline || "",
        heroTitle: settings.heroTitle || "",
        heroSubtitle: settings.heroSubtitle || "",
        primaryColor: settings.primaryColor || "#6C5B7B",
        secondaryColor: settings.secondaryColor || "#F4A261",
        accentColor: settings.accentColor || "#1F2937",
        contactEmail: settings.contactEmail || "",
        contactPhone: settings.contactPhone || "",
        address: settings.address || "",
        footerAbout: settings.footerAbout || "",
        newsletterText: settings.newsletterText || "",
        aboutTitle: settings.aboutTitle || "",
        aboutIntro: settings.aboutIntro || "",
        aboutBody: settings.aboutBody || "",
        contactTitle: settings.contactTitle || "",
        contactIntro: settings.contactIntro || "",
        contactSupportHours: settings.contactSupportHours || "",
        logo: settings.logo || "",
        heroImage: settings.heroImage || "",
        socialLinks: {
          instagram: settings.socialLinks?.instagram || "",
          facebook: settings.socialLinks?.facebook || "",
          tiktok: settings.socialLinks?.tiktok || "",
          x: settings.socialLinks?.x || "",
        },
      });
    }
  }, [settings]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(clearSettingsError());
    }
  }, [dispatch, error]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [field]: value,
      },
    }));
  };

  const handleFileChange = async (event, target) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const dataUrl = await toDataUrl(file);
    handleFieldChange(target, dataUrl);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch(updateSiteSettings(formData))
      .unwrap()
      .then(() => {
        toast.success(t("template.settings.updated"), {
          position: "top-center",
          autoClose: 2500,
        });
      });
  };

  if (!formData || loading) {
    return (
      <>
        <Navbar />
        <PageTitle title={t("template.settings.pageTitle")} />
        <div className="admin-settings-shell">
          <div className="admin-settings-loading">{t("template.common.loadingSettings")}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageTitle title={t("template.settings.pageTitle")} />

      <div className="admin-settings-shell">
        <AdminSidebar />

        <main className="admin-settings-main">
          <div className="admin-settings-header">
            <div>
              <h1>Store Settings</h1>
              <p>{t("template.settings.headerDesc")}</p>
            </div>
            <button type="submit" form="admin-settings-form" className="admin-settings-save-btn" disabled={saving}>
              <Save fontSize="small" />
              {saving ? t("template.common.saving") : t("template.common.saveChanges")}
            </button>
          </div>

          <form id="admin-settings-form" className="admin-settings-form" onSubmit={handleSubmit}>
            <section className="admin-settings-card">
              <div className="admin-settings-section-title">
                <Storefront />
                <div>
                  <h2>Brand Identity</h2>
                  <p>{t("template.settings.brandDesc")}</p>
                </div>
              </div>

              <div className="admin-settings-grid">
                <label>
                  {t("template.settings.storeName")}
                  <input value={formData.storeName} onChange={(e) => handleFieldChange("storeName", e.target.value)} />
                </label>
                <label>
                  {t("template.settings.tagline")}
                  <input value={formData.tagline} onChange={(e) => handleFieldChange("tagline", e.target.value)} />
                </label>
                <label className="admin-settings-full">
                  {t("template.settings.heroTitle")}
                  <input value={formData.heroTitle} onChange={(e) => handleFieldChange("heroTitle", e.target.value)} />
                </label>
                <label className="admin-settings-full">
                  {t("template.settings.heroSubtitle")}
                  <textarea rows="3" value={formData.heroSubtitle} onChange={(e) => handleFieldChange("heroSubtitle", e.target.value)} />
                </label>
                <label>
                  {t("template.settings.logoUrl")}
                  <input value={typeof formData.logo === "string" ? formData.logo : ""} onChange={(e) => handleFieldChange("logo", e.target.value)} placeholder="https://..." />
                </label>
                <label>
                  {t("template.settings.uploadLogo")}
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "logo")} />
                </label>
                <label>
                  {t("template.settings.heroImageUrl")}
                  <input value={typeof formData.heroImage === "string" ? formData.heroImage : ""} onChange={(e) => handleFieldChange("heroImage", e.target.value)} placeholder="https://..." />
                </label>
                <label>
                  {t("template.settings.uploadHeroImage")}
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "heroImage")} />
                </label>
              </div>
            </section>

            <section className="admin-settings-card">
              <div className="admin-settings-section-title">
                <Palette />
                <div>
                  <h2>Theme Colors</h2>
                  <p>{t("template.settings.themeDesc")}</p>
                </div>
              </div>

              <div className="admin-settings-grid admin-settings-colors">
                <label>
                  {t("template.settings.primaryColor")}
                  <input type="color" value={formData.primaryColor} onChange={(e) => handleFieldChange("primaryColor", e.target.value)} />
                </label>
                <label>
                  {t("template.settings.secondaryColor")}
                  <input type="color" value={formData.secondaryColor} onChange={(e) => handleFieldChange("secondaryColor", e.target.value)} />
                </label>
                <label>
                  {t("template.settings.accentColor")}
                  <input type="color" value={formData.accentColor} onChange={(e) => handleFieldChange("accentColor", e.target.value)} />
                </label>
              </div>

              <div className="admin-settings-preview">
                <span style={{ background: formData.primaryColor }} />
                <span style={{ background: formData.secondaryColor }} />
                <span style={{ background: formData.accentColor }} />
              </div>
            </section>

            <section className="admin-settings-card">
              <div className="admin-settings-section-title">
                <ContactMail />
                <div>
                  <h2>Contact and Social</h2>
                  <p>{t("template.settings.contactDesc")}</p>
                </div>
              </div>

              <div className="admin-settings-grid">
                <label>
                  {t("template.settings.contactEmail")}
                  <input value={formData.contactEmail} onChange={(e) => handleFieldChange("contactEmail", e.target.value)} />
                </label>
                <label>
                  {t("template.settings.contactPhone")}
                  <input value={formData.contactPhone} onChange={(e) => handleFieldChange("contactPhone", e.target.value)} />
                </label>
                <label className="admin-settings-full">
                  {t("template.settings.address")}
                  <input value={formData.address} onChange={(e) => handleFieldChange("address", e.target.value)} />
                </label>
                <label className="admin-settings-full">
                  {t("template.settings.footerAbout")}
                  <textarea rows="3" value={formData.footerAbout} onChange={(e) => handleFieldChange("footerAbout", e.target.value)} />
                </label>
                <label className="admin-settings-full">
                  {t("template.settings.newsletterText")}
                  <textarea rows="2" value={formData.newsletterText} onChange={(e) => handleFieldChange("newsletterText", e.target.value)} />
                </label>
                <label>
                  Instagram
                  <input value={formData.socialLinks.instagram} onChange={(e) => handleSocialChange("instagram", e.target.value)} />
                </label>
                <label>
                  Facebook
                  <input value={formData.socialLinks.facebook} onChange={(e) => handleSocialChange("facebook", e.target.value)} />
                </label>
                <label>
                  TikTok
                  <input value={formData.socialLinks.tiktok} onChange={(e) => handleSocialChange("tiktok", e.target.value)} />
                </label>
                <label>
                  X
                  <input value={formData.socialLinks.x} onChange={(e) => handleSocialChange("x", e.target.value)} />
                </label>
              </div>
            </section>

            <section className="admin-settings-card">
              <div className="admin-settings-section-title">
                <Description />
                <div>
                  <h2>About and Contact Pages</h2>
                  <p>Control the main copy shown in the public About Us and Contact Us pages.</p>
                </div>
              </div>

              <div className="admin-settings-grid">
                <label className="admin-settings-full">
                  About page heading
                  <input value={formData.aboutTitle} onChange={(e) => handleFieldChange("aboutTitle", e.target.value)} />
                </label>
                <label className="admin-settings-full">
                  About page intro
                  <textarea rows="3" value={formData.aboutIntro} onChange={(e) => handleFieldChange("aboutIntro", e.target.value)} />
                </label>
                <label className="admin-settings-full">
                  About page body
                  <textarea rows="5" value={formData.aboutBody} onChange={(e) => handleFieldChange("aboutBody", e.target.value)} />
                </label>
                <label className="admin-settings-full">
                  Contact page heading
                  <input value={formData.contactTitle} onChange={(e) => handleFieldChange("contactTitle", e.target.value)} />
                </label>
                <label className="admin-settings-full">
                  Contact page intro
                  <textarea rows="3" value={formData.contactIntro} onChange={(e) => handleFieldChange("contactIntro", e.target.value)} />
                </label>
                <label className="admin-settings-full">
                  Contact support hours
                  <textarea rows="2" value={formData.contactSupportHours} onChange={(e) => handleFieldChange("contactSupportHours", e.target.value)} />
                </label>
              </div>
            </section>
          </form>
        </main>
      </div>
    </>
  );
}

export default AdminSettings;

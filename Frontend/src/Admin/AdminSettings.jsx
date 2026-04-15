import React, { useEffect, useMemo, useState } from "react";
import { Palette, Storefront, ContactMail, ViewCarousel, Save } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
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
        logo: settings.logo || "",
        heroImage: settings.heroImage || "",
        socialLinks: {
          instagram: settings.socialLinks?.instagram || "",
          facebook: settings.socialLinks?.facebook || "",
          tiktok: settings.socialLinks?.tiktok || "",
          x: settings.socialLinks?.x || "",
        },
        heroSlides: (settings.heroSlides || []).slice(0, 2).map((slide) => ({
          image: slide.image || "",
          title: slide.title || "",
          subtitle: slide.subtitle || "",
          ctaLabel: slide.ctaLabel || "",
          ctaLink: slide.ctaLink || "/products",
        })),
      });
    }
  }, [settings]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(clearSettingsError());
    }
  }, [dispatch, error]);

  const filledSlides = useMemo(() => {
    if (!formData?.heroSlides?.length) return [];
    return formData.heroSlides.filter(
      (slide) => slide.image || slide.title || slide.subtitle || slide.ctaLabel
    );
  }, [formData]);

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

  const handleSlideChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.map((slide, slideIndex) =>
        slideIndex === index ? { ...slide, [field]: value } : slide
      ),
    }));
  };

  const handleFileChange = async (event, target, slideIndex = null) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const dataUrl = await toDataUrl(file);

    if (slideIndex !== null) {
      handleSlideChange(slideIndex, "image", dataUrl);
      return;
    }

    handleFieldChange(target, dataUrl);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      ...formData,
      heroSlides: filledSlides,
    };

    dispatch(updateSiteSettings(payload))
      .unwrap()
      .then(() => {
        toast.success("Store settings updated successfully", {
          position: "top-center",
          autoClose: 2500,
        });
      });
  };

  if (!formData || loading) {
    return (
      <>
        <Navbar />
        <PageTitle title="Admin Settings" />
        <div className="admin-settings-shell">
          <div className="admin-settings-loading">Loading store settings...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageTitle title="Admin Settings" />

      <div className="admin-settings-shell">
        <aside className="admin-settings-sidebar">
          <div className="admin-settings-brand">Template Control</div>
          <nav className="admin-settings-nav">
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/products">Products</Link>
            <Link to="/admin/orders">Orders</Link>
            <Link to="/admin/reviews">Reviews</Link>
            <Link to="/admin/settings" className="active">Settings</Link>
          </nav>
        </aside>

        <main className="admin-settings-main">
          <div className="admin-settings-header">
            <div>
              <h1>Store Settings</h1>
              <p>Customize the brand, homepage content, and contact details from one place.</p>
            </div>
            <button type="submit" form="admin-settings-form" className="admin-settings-save-btn" disabled={saving}>
              <Save fontSize="small" />
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>

          <form id="admin-settings-form" className="admin-settings-form" onSubmit={handleSubmit}>
            <section className="admin-settings-card">
              <div className="admin-settings-section-title">
                <Storefront />
                <div>
                  <h2>Brand Identity</h2>
                  <p>Update the store name, logo, tagline, and key messaging.</p>
                </div>
              </div>

              <div className="admin-settings-grid">
                <label>
                  Store Name
                  <input value={formData.storeName} onChange={(e) => handleFieldChange("storeName", e.target.value)} />
                </label>
                <label>
                  Tagline
                  <input value={formData.tagline} onChange={(e) => handleFieldChange("tagline", e.target.value)} />
                </label>
                <label className="admin-settings-full">
                  Hero Title
                  <input value={formData.heroTitle} onChange={(e) => handleFieldChange("heroTitle", e.target.value)} />
                </label>
                <label className="admin-settings-full">
                  Hero Subtitle
                  <textarea rows="3" value={formData.heroSubtitle} onChange={(e) => handleFieldChange("heroSubtitle", e.target.value)} />
                </label>
                <label>
                  Logo URL or Upload
                  <input value={typeof formData.logo === "string" ? formData.logo : ""} onChange={(e) => handleFieldChange("logo", e.target.value)} placeholder="https://..." />
                </label>
                <label>
                  Upload Logo
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "logo")} />
                </label>
                <label>
                  Hero Image URL
                  <input value={typeof formData.heroImage === "string" ? formData.heroImage : ""} onChange={(e) => handleFieldChange("heroImage", e.target.value)} placeholder="https://..." />
                </label>
                <label>
                  Upload Hero Image
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "heroImage")} />
                </label>
              </div>
            </section>

            <section className="admin-settings-card">
              <div className="admin-settings-section-title">
                <Palette />
                <div>
                  <h2>Theme Colors</h2>
                  <p>These values update the main storefront theme instantly.</p>
                </div>
              </div>

              <div className="admin-settings-grid admin-settings-colors">
                <label>
                  Primary Color
                  <input type="color" value={formData.primaryColor} onChange={(e) => handleFieldChange("primaryColor", e.target.value)} />
                </label>
                <label>
                  Secondary Color
                  <input type="color" value={formData.secondaryColor} onChange={(e) => handleFieldChange("secondaryColor", e.target.value)} />
                </label>
                <label>
                  Accent Color
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
                  <p>Control the footer, contact area, and social media links.</p>
                </div>
              </div>

              <div className="admin-settings-grid">
                <label>
                  Contact Email
                  <input value={formData.contactEmail} onChange={(e) => handleFieldChange("contactEmail", e.target.value)} />
                </label>
                <label>
                  Contact Phone
                  <input value={formData.contactPhone} onChange={(e) => handleFieldChange("contactPhone", e.target.value)} />
                </label>
                <label className="admin-settings-full">
                  Address
                  <input value={formData.address} onChange={(e) => handleFieldChange("address", e.target.value)} />
                </label>
                <label className="admin-settings-full">
                  Footer About
                  <textarea rows="3" value={formData.footerAbout} onChange={(e) => handleFieldChange("footerAbout", e.target.value)} />
                </label>
                <label className="admin-settings-full">
                  Newsletter Text
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
                <ViewCarousel />
                <div>
                  <h2>Hero Slides</h2>
                  <p>Prepare up to two premium homepage slides with CTA buttons.</p>
                </div>
              </div>

              <div className="admin-settings-slides">
                {formData.heroSlides.map((slide, index) => (
                  <div className="admin-settings-slide-card" key={index}>
                    <h3>Slide {index + 1}</h3>
                    <label>
                      Slide Image URL
                      <input value={slide.image} onChange={(e) => handleSlideChange(index, "image", e.target.value)} placeholder="https://..." />
                    </label>
                    <label>
                      Upload Slide Image
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, null, index)} />
                    </label>
                    <label>
                      Title
                      <input value={slide.title} onChange={(e) => handleSlideChange(index, "title", e.target.value)} />
                    </label>
                    <label>
                      Subtitle
                      <textarea rows="3" value={slide.subtitle} onChange={(e) => handleSlideChange(index, "subtitle", e.target.value)} />
                    </label>
                    <label>
                      CTA Label
                      <input value={slide.ctaLabel} onChange={(e) => handleSlideChange(index, "ctaLabel", e.target.value)} />
                    </label>
                    <label>
                      CTA Link
                      <input value={slide.ctaLink} onChange={(e) => handleSlideChange(index, "ctaLink", e.target.value)} />
                    </label>
                  </div>
                ))}
              </div>
            </section>
          </form>
        </main>
      </div>
    </>
  );
}

export default AdminSettings;

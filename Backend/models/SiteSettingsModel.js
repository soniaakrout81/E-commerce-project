import mongoose from "mongoose";

const socialLinksSchema = new mongoose.Schema(
  {
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    tiktok: { type: String, default: "" },
    x: { type: String, default: "" },
  },
  { _id: false }
);

const heroSlideSchema = new mongoose.Schema(
  {
    image: { type: String, default: "" },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    ctaLabel: { type: String, default: "" },
    ctaLink: { type: String, default: "/products" },
  },
  { _id: false }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      default: "SHOP EASY",
      trim: true,
    },
    tagline: {
      type: String,
      default: "Premium products curated for modern shoppers.",
      trim: true,
    },
    logo: {
      type: String,
      default: "",
    },
    favicon: {
      type: String,
      default: "",
    },
    heroTitle: {
      type: String,
      default: "A premium storefront ready for your next client.",
      trim: true,
    },
    heroSubtitle: {
      type: String,
      default: "Swap the brand, upload products, and launch a polished online store in days.",
      trim: true,
    },
    heroImage: {
      type: String,
      default: "",
    },
    primaryColor: {
      type: String,
      default: "#6C5B7B",
      trim: true,
    },
    secondaryColor: {
      type: String,
      default: "#F4A261",
      trim: true,
    },
    accentColor: {
      type: String,
      default: "#1F2937",
      trim: true,
    },
    fontHeading: {
      type: String,
      default: "'Poppins', sans-serif",
      trim: true,
    },
    fontBody: {
      type: String,
      default: "'Inter', sans-serif",
      trim: true,
    },
    contactEmail: {
      type: String,
      default: "",
      trim: true,
    },
    contactPhone: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    newsletterText: {
      type: String,
      default: "Subscribe for launches, limited offers, and product drops.",
      trim: true,
    },
    footerAbout: {
      type: String,
      default: "A reusable white-label e-commerce template built for fast premium delivery.",
      trim: true,
    },
    aboutTitle: {
      type: String,
      default: "Built for brands that want to feel premium from day one.",
      trim: true,
    },
    aboutIntro: {
      type: String,
      default: "Use this page to introduce the store, explain the value behind the products, and build trust with new shoppers.",
      trim: true,
    },
    aboutBody: {
      type: String,
      default: "This template helps you deliver a polished storefront with strong branding, smooth shopping flows, and a clean admin experience that clients can manage confidently.",
      trim: true,
    },
    contactTitle: {
      type: String,
      default: "We are here to help before and after every order.",
      trim: true,
    },
    contactIntro: {
      type: String,
      default: "Customize this section with your support tone, response expectations, and the best way for customers to reach you.",
      trim: true,
    },
    contactSupportHours: {
      type: String,
      default: "Support hours: Monday to Saturday, 9:00 AM to 6:00 PM.",
      trim: true,
    },
    socialLinks: {
      type: socialLinksSchema,
      default: () => ({}),
    },
    heroSlides: {
      type: [heroSlideSchema],
      default: () => [
        {
          image: "/images/image1.png",
          title: "Launch a premium store faster",
          subtitle: "Designed to help you ship polished client stores with less effort.",
          ctaLabel: "Shop collection",
          ctaLink: "/products",
        },
        {
          image: "/images/image2.png",
          title: "Flexible branding for every client",
          subtitle: "Swap banners, colors, logo, and messaging without touching core code.",
          ctaLabel: "Explore products",
          ctaLink: "/products",
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("SiteSettings", siteSettingsSchema);

import { v2 as cloudinary } from "cloudinary";
import HandleAsyncError from "../middleware/HandleAsyncError.js";
import SiteSettings from "../models/SiteSettingsModel.js";

const DEFAULT_IMAGE_FIELDS = ["logo", "favicon", "heroImage"];

const uploadAssetIfNeeded = async (value, folder) => {
  if (!value || typeof value !== "string") return value;
  if (!value.startsWith("data:image")) return value;

  const uploaded = await cloudinary.uploader.upload(value, { folder });
  return uploaded.secure_url;
};

const normalizeSlides = async (slides = []) => {
  const normalizedSlides = await Promise.all(
    slides.map(async (slide) => ({
      image: await uploadAssetIfNeeded(slide.image, "site-settings/slides"),
      title: slide.title || "",
      subtitle: slide.subtitle || "",
      ctaLabel: slide.ctaLabel || "",
      ctaLink: slide.ctaLink || "/products",
    }))
  );

  return normalizedSlides.filter((slide) => slide.image || slide.title || slide.subtitle);
};

const getOrCreateSettings = async () => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return settings;
};

export const getPublicSiteSettings = HandleAsyncError(async (req, res) => {
  const settings = await getOrCreateSettings();

  res.status(200).json({
    success: true,
    settings,
  });
});

export const updateSiteSettings = HandleAsyncError(async (req, res) => {
  const settings = await getOrCreateSettings();

  for (const field of DEFAULT_IMAGE_FIELDS) {
    if (typeof req.body[field] !== "undefined") {
      settings[field] = await uploadAssetIfNeeded(req.body[field], "site-settings");
    }
  }

  const simpleFields = [
    "storeName",
    "tagline",
    "heroTitle",
    "heroSubtitle",
    "primaryColor",
    "secondaryColor",
    "accentColor",
    "fontHeading",
    "fontBody",
    "contactEmail",
    "contactPhone",
    "address",
    "newsletterText",
    "footerAbout",
  ];

  simpleFields.forEach((field) => {
    if (typeof req.body[field] !== "undefined") {
      settings[field] = req.body[field];
    }
  });

  if (req.body.socialLinks) {
    settings.socialLinks = {
      ...settings.socialLinks?.toObject?.(),
      ...req.body.socialLinks,
    };
  }

  if (Array.isArray(req.body.heroSlides)) {
    settings.heroSlides = await normalizeSlides(req.body.heroSlides);
  }

  await settings.save();

  res.status(200).json({
    success: true,
    message: "Site settings updated successfully",
    settings,
  });
});

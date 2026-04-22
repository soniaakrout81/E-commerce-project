import { useEffect } from "react";

function updateHeadElement(tagName, selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement(tagName);
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      element.setAttribute(key, value);
    }
  });

  return element;
}

function MetaTags({
  title,
  description,
  keywords,
  image,
  type = "website",
  path = "",
  robots = "index, follow",
  schema,
}) {
  useEffect(() => {
    const origin = window.location.origin;
    const canonicalUrl = `${origin}${path || window.location.pathname}${path ? "" : window.location.search}`;
    const appliedTitle = title || document.title;

    if (appliedTitle) {
      document.title = appliedTitle;
      updateHeadElement("meta", 'meta[property="og:title"]', { property: "og:title", content: appliedTitle });
      updateHeadElement("meta", 'meta[name="twitter:title"]', { name: "twitter:title", content: appliedTitle });
    }

    if (description) {
      updateHeadElement("meta", 'meta[name="description"]', { name: "description", content: description });
      updateHeadElement("meta", 'meta[property="og:description"]', { property: "og:description", content: description });
      updateHeadElement("meta", 'meta[name="twitter:description"]', { name: "twitter:description", content: description });
    }

    if (keywords) {
      updateHeadElement("meta", 'meta[name="keywords"]', { name: "keywords", content: keywords });
    }

    updateHeadElement("meta", 'meta[name="robots"]', { name: "robots", content: robots });
    updateHeadElement("meta", 'meta[property="og:type"]', { property: "og:type", content: type });
    updateHeadElement("meta", 'meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    updateHeadElement("meta", 'meta[name="twitter:card"]', { name: "twitter:card", content: image ? "summary_large_image" : "summary" });
    updateHeadElement("meta", 'meta[name="twitter:url"]', { name: "twitter:url", content: canonicalUrl });

    if (image) {
      updateHeadElement("meta", 'meta[property="og:image"]', { property: "og:image", content: image });
      updateHeadElement("meta", 'meta[name="twitter:image"]', { name: "twitter:image", content: image });
    }

    updateHeadElement("link", 'link[rel="canonical"]', { rel: "canonical", href: canonicalUrl });

    let schemaScript = null;
    if (schema) {
      schemaScript = document.head.querySelector('script[data-schema="page-schema"]');
      if (!schemaScript) {
        schemaScript = document.createElement("script");
        schemaScript.type = "application/ld+json";
        schemaScript.dataset.schema = "page-schema";
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    }

    return () => {
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [title, description, keywords, image, type, path, robots, schema]);

  return null;
}

export default MetaTags;

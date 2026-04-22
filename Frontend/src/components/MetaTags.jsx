import { useEffect } from "react";

function updateMetaTag(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function MetaTags({ title, description, keywords }) {
  useEffect(() => {
    if (title) {
      document.title = title;
      updateMetaTag('meta[property="og:title"]', { property: "og:title", content: title });
    }

    if (description) {
      updateMetaTag('meta[name="description"]', { name: "description", content: description });
      updateMetaTag('meta[property="og:description"]', { property: "og:description", content: description });
    }

    if (keywords) {
      updateMetaTag('meta[name="keywords"]', { name: "keywords", content: keywords });
    }
  }, [title, description, keywords]);

  return null;
}

export default MetaTags;

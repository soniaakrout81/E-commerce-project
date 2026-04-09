import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../componentStyles/ImageSlider.css";

const images = [
  "/images/image1.png",
  "/images/image2.png",
  "/images/image3.png",
  "/images/image4.png",
];

function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleTransitionEnd = () => {
    if (currentIndex >= images.length) {
      sliderRef.current.style.transition = "none";
      setCurrentIndex(0);
      sliderRef.current.style.transform = `translateX(0%)`;
      setTimeout(() => {
        sliderRef.current.style.transition = "transform 0.8s ease-in-out";
      }, 50);
    }
  };

  return (
    <div className="image-slider-container">
      <div
        className="slider-images"
        ref={sliderRef}
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: "transform 0.8s ease-in-out",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {images.map((image, index) => (
          <div className="slider-item" key={index}>
            <img src={image} alt={t("imageSlider.slideAlt", { index: index + 1 })} />
          </div>
        ))}

        <div className="slider-item">
          <img src={images[0]} alt={t("imageSlider.slideCloneAlt")} />
        </div>
      </div>

      <div className="slider-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === (currentIndex % images.length) ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;

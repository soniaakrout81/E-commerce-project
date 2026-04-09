import React, { useMemo, useState } from "react";
import "../componentStyles/Rating.css";

function Rating({ value = 0, onRatingChange, disabled = false }) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(value || 0);

  const currentValue = useMemo(() => {
    if (disabled) return value || 0;
    return hoveredRating || selectedRating || 0;
  }, [disabled, hoveredRating, selectedRating, value]);

  const handleMouseEnter = (rating) => {
    if (!disabled) setHoveredRating(rating);
  };

  const handleMouseLeave = () => {
    if (!disabled) setHoveredRating(0);
  };

  const handleClick = (rating) => {
    if (disabled) return;
    setSelectedRating(rating);
    if (onRatingChange) onRatingChange(rating);
  };

  const stars = [];
  for (let i = 1; i <= 5; i += 1) {
    const isFilled = i <= currentValue;
    stars.push(
      <span
        key={i}
        className={`star ${isFilled ? "filled" : "empty"}`}
        onMouseEnter={() => handleMouseEnter(i)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(i)}
        style={{ pointerEvents: disabled ? "none" : "auto" }}
      >
        {"\u2605"}
      </span>
    );
  }

  return <div className="rating">{stars}</div>;
}

export default Rating;

import React from "react";

function ProgressBar({ color, name, ariaLabel, current, max }) {
  const progress = max > 0 ? Math.min(Math.max(current, 0), max) : 0;

  return (
    <div
      className="companion-health-bar"
      role="progressbar"
      aria-label={ariaLabel || name}
      aria-valuemin={0}
      aria-valuemax={max > 0 ? max : 1}
      aria-valuenow={progress}
      aria-valuetext={`${current} von ${max}`}
    >
      <div
        className={`companion-health-bar__fill ${color || ""}`}
        style={{ width: `${max > 0 ? (progress / max) * 100 : 0}%` }}
        aria-hidden="true"
      />
      <span className="companion-health-bar__label">
        {name ? `${name}: ` : ""}{current} / {max}
      </span>
    </div>
  );
}

export default ProgressBar;

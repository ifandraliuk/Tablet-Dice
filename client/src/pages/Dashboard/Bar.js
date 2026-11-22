import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { germanAttr } from "../../data/ConstVariables";
import { generateBar } from "../../features/player/playerSlice";

function Bar({ category }) {
  const { bars, attributes, attributesLoaded } = useSelector((state) => state.player);
  const dispatch = useDispatch();
  const max = attributes ? attributes[category] * 10 : 0;
  const curr = bars ? bars[category] : 0;
  const progress = max > 0 ? Math.min(Math.max(curr, 0), max) : 0;

  useEffect(() => {
    if (attributesLoaded) {
      dispatch(generateBar());
    }
  }, [attributesLoaded, dispatch]);

  return (
    <div
      className="dashboard-resource-bar"
      role="progressbar"
      aria-label={germanAttr[category]}
      aria-valuemin={0}
      aria-valuemax={max > 0 ? max : 1}
      aria-valuenow={progress}
      aria-valuetext={`${curr} von ${max}`}
    >
      <div
        className={`dashboard-resource-bar__fill dashboard-resource-bar__fill--${category}`}
        style={{ width: `${max > 0 ? (progress / max) * 100 : 0}%` }}
        aria-hidden="true"
      />
      <span className="dashboard-resource-bar__label">
        {germanAttr[category]}: {curr} / {max}
      </span>
    </div>
  );
}

export default Bar;

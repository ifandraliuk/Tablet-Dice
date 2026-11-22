import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { stationAccess, stationPointRequirements } from "./craftingData";

export default function StationImage({ station, index, points, context, allStations = false, onZoom }) {
  const [imageFailure, setImageFailure] = useState(null);
  const imageStatus = imageFailure?.src === station.image ? imageFailure.status : null;
  const access = stationAccess(points, index);
  const planned = station.values.length === 0;
  const status = planned ? "Herstellungsort folgt" : access === "exception"
    ? "Ungelernt mit Malus nutzbar"
    : access === "locked" ? `Gesperrt · ab ${stationPointRequirements[index]} Talentpunkten` : "Freigeschaltet";

  const handleImageError = async () => {
    const src = station.image;
    setImageFailure({ src, status: "checking" });
    try {
      const response = await fetch(src);
      setImageFailure({ src, status: response.status === 404 || response.status === 410 ? "missing" : "error" });
    } catch (error) {
      setImageFailure({ src, status: "error" });
    }
  };

  return (
    <span className={`crafting-station-image crafting-station-image--${context}`}>
      <span className="crafting-station-image__visual">
        {station.image && !imageStatus && <img className="crafting-station-image__image" src={station.image} alt="" onError={handleImageError} />}
        {(!station.image || imageStatus === "missing") && <span className="crafting-station-image__placeholder">Bild folgt</span>}
        {imageStatus === "error" && <span className="crafting-station-image__placeholder">Bild konnte nicht geladen werden</span>}
      </span>
      {context !== "card" && <span className="crafting-station-image__content">
        <span className="crafting-station-image__eyebrow">{allStations ? "Alle Stufen · Ortsvorschau" : "Herstellungsort"} · Stufe {index + 1}</span>
        <span className="crafting-station-image__name">{station.name}</span>
        <span className="crafting-station-image__status">{status}</span>
        {context === "detail" && <button type="button" className="crafting-station-image__zoom" aria-label={`${station.name} vergrößern`} title="Herstellungsort vergrößern" aria-haspopup="dialog" onClick={onZoom}><FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" /></button>}
      </span>}
    </span>
  );
}

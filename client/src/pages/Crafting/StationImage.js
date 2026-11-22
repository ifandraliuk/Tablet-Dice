import React, { useState } from "react";
import { stationAccess, stationPointRequirements } from "./craftingData";

export default function StationImage({ station, index, points, context, allStations = false }) {
  const [imageError, setImageError] = useState(false);
  const access = stationAccess(points, index);
  const planned = station.values.length === 0;
  const status = planned ? "Herstellungsort folgt" : access === "exception"
    ? "Ungelernt mit Malus nutzbar"
    : access === "locked" ? `Gesperrt · ab ${stationPointRequirements[index]} Talentpunkten` : "Freigeschaltet";

  return (
    <span className={`crafting-station-image crafting-station-image--${context}`}>
      <span className="crafting-station-image__visual">
        {station.image && !imageError && <img className="crafting-station-image__image" src={station.image} alt="" onError={() => setImageError(true)} />}
        {!station.image && <span className="crafting-station-image__placeholder">Bild folgt</span>}
        {imageError && <span className="crafting-station-image__placeholder">Bild konnte nicht geladen werden</span>}
      </span>
      {context === "detail" && <span className="crafting-station-image__content">
        <span className="crafting-station-image__eyebrow">{allStations ? "Alle Stufen · Ortsvorschau" : "Herstellungsort"} · Stufe {index + 1}</span>
        <span className="crafting-station-image__name">{station.name}</span>
        <span className="crafting-station-image__status">{status}</span>
      </span>}
    </span>
  );
}

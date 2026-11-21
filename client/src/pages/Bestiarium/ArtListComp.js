import React, { memo } from "react";

const ArtListComp = memo(({ arts, filter, selectedArt }) => {
  return (
    <div
      className="bestiaria-art-filters"
      role="group"
      aria-label="Nach Gattung filtern"
    >
      <button
        type="button"
        className={!selectedArt ? "is-active" : ""}
        aria-pressed={!selectedArt}
        onClick={() => filter("")}
      >
        Alle
      </button>
      {arts?.map((art) => (
        <button
          type="button"
          key={art}
          className={selectedArt === art ? "is-active" : ""}
          aria-pressed={selectedArt === art}
          onClick={() => filter(art)}
        >
          {art}
        </button>
      ))}
    </div>
  );
});

export default ArtListComp;

import React, { memo } from "react";

const HabitatList = memo(({ habitats, filter, fractionTheme }) => {
  return (
    <div className="row">
      {habitats.map((h) => (
        <button
          className={fractionTheme}
          id={h._id}
          key={h._id}
          onClick={(e) => filter(e.currentTarget.id)}
        >
          {h.name}
        </button>
      ))}
    </div>
  );
});

export default HabitatList;

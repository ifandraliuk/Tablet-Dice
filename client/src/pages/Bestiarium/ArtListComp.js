import React, { memo } from "react";
import MotionButton from "../../components/MotionButton";

const ArtListComp = memo(({ arts, filter, fractionTheme }) => {

  return (
    <div className="row">
      {arts?.map((art) => (
        <MotionButton
          name={art}
          key={art}
          onClick={(e) => filter(e.currentTarget.name)}
          content={art}
        />
      ))}
    </div>
  );
});

export default ArtListComp;

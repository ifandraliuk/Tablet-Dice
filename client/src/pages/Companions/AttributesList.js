import React from "react";
import {
    faArrowsToCircle,
    faDice,
    faHeart,
    faShield,
    faWeightHanging,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  
function AttributesList({hitpoints, hitchance, capacity, armor}) {
  return (
    <div className="row">
      <div className="col-auto">
        <FontAwesomeIcon icon={faHeart} />
        {hitpoints}
      </div>
      <div className="col-auto ms-auto">
        <FontAwesomeIcon icon={faDice} />
        {hitchance}
      </div>
      <div className="col-auto ms-auto me-auto">
        <FontAwesomeIcon icon={faWeightHanging} />
        {capacity}
      </div>
      <div className="col-auto ms-auto">
        <FontAwesomeIcon icon={faShield} />
        {armor}
      </div>
    </div>
  );
}

export default AttributesList;

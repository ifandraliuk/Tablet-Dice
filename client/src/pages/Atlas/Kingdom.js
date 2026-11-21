import React from "react";
import { useSelector, useDispatch } from "react-redux";
import MotionButton from "../../components/MotionButton";
import HabitatInfo from "./KingdomHabitat";
import Fraction from "../../components/Fraction";
import {
  faBook,
  faGlobe,
  faMountain,
} from "@fortawesome/free-solid-svg-icons";
import { setKingdomCategory } from "../../features/atlas/atlasSlice";

function Kingdom({ kingdom, showMap }) {
  const { activeKingdomName, kingdomCategory } = useSelector(
    (state) => state.atlas
  );
  const dispatch = useDispatch();

  const setActive = (e) => {
    const kingdomName = kingdom.name;
    const category = e.currentTarget.name;
    dispatch(setKingdomCategory({ name: kingdomName, category }));
  };
  return (
    
    <div key={kingdom.name} className={`row info-div mb-4 atlas-kingdom atlas-kingdom--${kingdom.name}`}>
      
      <div className="col-12 col-md-4 atlas-kingdom__identity">
        <div className="row justify-content-end">
          <div className="col-7">
            <h1>{kingdom.name}</h1>
          </div>
          <div className="col-10">
            <Fraction key={kingdom.name} fraction={kingdom.name} />
          </div>
        </div>
      </div>
      <div className="col-12 col-md-8 atlas-kingdom-panel">
        <div className="row m-2">
          <div className="col-auto">
            <MotionButton
              content="Allgemein"
              name="general"
              onClick={setActive}
              theme={
                activeKingdomName === kingdom.name &&
                kingdomCategory === "general"
                  ? kingdom.name
                  : ""
              }
              ariaPressed={
                activeKingdomName === kingdom.name &&
                kingdomCategory === "general"
              }
              icon={faBook}
            />
          </div>
          <div className="col-auto">
            <MotionButton
              content="Habitate"
              name="habitat"
              icon={faMountain}
              onClick={(e) => setActive(e)}
              theme={
                activeKingdomName === kingdom.name &&
                kingdomCategory === "habitat"
                  ? kingdom.name
                  : ""
              }
              ariaPressed={
                activeKingdomName === kingdom.name &&
                kingdomCategory === "habitat"
              }
            />
          </div>
          <div className="col-auto">
            <MotionButton
              content="Karte"
              name="map"
              icon={faGlobe}
              onClick={(e) => {
                setActive(e);
                showMap();
              }}
              theme={
                activeKingdomName === kingdom.name && kingdomCategory === "map"
                  ? kingdom.name
                  : ""
              }
              ariaPressed={
                activeKingdomName === kingdom.name && kingdomCategory === "map"
              }
            />
          </div>
        </div>
        {activeKingdomName === kingdom.name &&
        kingdomCategory === "general" ? (
          <div className="row m-2">
            <div className="col">
              <h2>Hauptstadt</h2>
              <p>{kingdom.capital}</p>
              <h2>Religion</h2>
              <p>{kingdom.religion}</p>
              <h2>Regierungsform</h2>
              <p>{kingdom.goverment}</p>
              <h2>Allgemein</h2>
              <p>{kingdom.description}</p>
            </div>
          </div>
        ) : null}
        {activeKingdomName === kingdom.name && kingdomCategory === "habitat" ? (
          <>
            {kingdom?.habitat?.map((habitat) => (
              <HabitatInfo
                key={habitat._id}
                habitat={habitat}
                kingdom={kingdom.name}
              />
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Kingdom;

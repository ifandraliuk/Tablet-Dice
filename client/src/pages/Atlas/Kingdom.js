import React from "react";
import { useSelector, useDispatch } from "react-redux";
import MotionButton from "../../components/MotionButton";
import HabitatInfo from "./KingdomHabitat";
import Fraction from "../../components/Fraction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faGlobe,
  faLeaf,
  faMountain,
} from "@fortawesome/free-solid-svg-icons";
import { setKingdomCategory } from "../../features/atlas/atlasSlice";


function Kingdom({
  fractionTheme,
  kingdom,
  showMap,
  setActiveKingdom,
  activeKingdom,
  setActiveHabitat,
}) {
  const { activeKingdomName, kingdomCategory } = useSelector(
    (state) => state.atlas
  );
  const dispatch = useDispatch();

  const setActive = (e) => {
    const kingdomName = kingdom.name;
    const category = e.currentTarget.name;
    const data = {
      name: kingdomName,
      category: category,
    };
    console.log(data);
    dispatch(setKingdomCategory(data));
  };
  return (
    
    <div key={kingdom.name} className="row info-div mb-4">
      
      <div className="col-4">
        <div className="row justify-content-end">
          <div className="col-7">
            <h1>{kingdom.name}</h1>
          </div>
          <div className="col-10">
            <Fraction key={kingdom.name} fraction={kingdom.name} />
          </div>
        </div>
      </div>
      <div className="col-8 border-pattern left repeat">
        <div className="row m-2">
          <div className="col-auto">
            <MotionButton
              content="Allgemein"
              name="general"
              onClick={setActive}
              theme={
                activeKingdomName === kingdom.name &&
                kingdomCategory === "general"
                  ? fractionTheme
                  : ""
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
                  ? fractionTheme
                  : ""
              }
            />
          </div>
          <div className="col-auto">
            <MotionButton
              content="Karte"
              name="map"
              icon={faGlobe}
              onClick={(e) => {setActive(e); showMap(e)}}
              theme={
                activeKingdomName === kingdom.name && kingdomCategory === "map"
                  ? fractionTheme
                  : ""
              }
            />
          </div>
        </div>
        {activeKingdomName !== kingdom.name ||
        (activeKingdomName === kingdom.name &&
          kingdomCategory === "general") ? (
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

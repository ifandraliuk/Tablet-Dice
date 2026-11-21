import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  faLeaf,
  faPaw,
  faPersonWalking,
  faReply,
} from "@fortawesome/free-solid-svg-icons";
import MotionButton from "../../components/MotionButton";
import {
  resetActiveHabitat,
  setHabitatCategory,
} from "../../features/atlas/atlasSlice";
import RessourceList from "./RessourceList";
import CreatureList from "./CreatureList";
import HumanoidList from "./HumanoidList";

const HabitatDetails = () => {
  const { activeKingdomName, activeHabitat, habitatCategory } = useSelector(
    (state) => state.atlas
  );
  const dispatch = useDispatch();

  const onBack = () => {
    dispatch(resetActiveHabitat());
  };

  const onHabitatCategory = (e) => {
    const category = e.currentTarget.name;
    dispatch(setHabitatCategory({ category }));
  };
  return (
    <div
      className={`container-fluid atlas-habitat-view atlas-kingdom--${activeKingdomName}`}
    >
      <div className="row mb-4 atlas-habitat-layout">
        <div className="col-12 col-md-4 atlas-habitat-visual">
          <img
            alt=""
            className="img-habitat"
            src={`habitat/${activeKingdomName}/${activeHabitat._id}.png`}
          />
        </div>

        <div className="col-12 col-md-8 dark-bg atlas-habitat-panel">
          <h1>{activeHabitat.name}</h1>
          <div className="row atlas-habitat-navigation">
            <div className="col-auto">
              <MotionButton
                content="Ressourcen"
                name="ressource"
                icon={faLeaf}
                onClick={(e) => onHabitatCategory(e)}
                ariaPressed={habitatCategory === "ressource"}
                className="atlas-tab-button"
              />
            </div>
            <div className="col-auto">
              <MotionButton
                content="Tiere"
                name="creature"
                icon={faPaw}
                onClick={(e) => onHabitatCategory(e)}
                ariaPressed={habitatCategory === "creature"}
                className="atlas-tab-button"
              />
            </div>
            <div className="col-auto">
              <MotionButton
                content="Humanoide"
                name="human"
                icon={faPersonWalking}
                onClick={(e) => onHabitatCategory(e)}
                ariaPressed={habitatCategory === "human"}
                className="atlas-tab-button"
              />
            </div>
            <div className="col-auto">
              <MotionButton
                content="Zurück zu Habitaten"
                name="back"
                icon={faReply}
                onClick={onBack}
              />
            </div>
          </div>
          <div className="container-fluid atlas-habitat-list">
            <div className="row">
              {habitatCategory === "ressource" ? (
                <RessourceList />
              ) : habitatCategory === "creature" ? (
                <CreatureList />
              ) : habitatCategory === "human" ? (
                <HumanoidList />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitatDetails;

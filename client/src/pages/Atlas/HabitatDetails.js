import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
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
    <div className=" container-fluid">
      <div className="row mb-4">
        <div className="col-4">
          <img
            alt=""
            className="img-habitat"
            src={`habitat/${activeKingdomName}/${activeHabitat._id}.png`}
          />
          
        </div>

        <div className="col-8 dark-bg border-pattern left repeat">
        <h1>{activeHabitat.name}</h1>
          <div className="row">
            <div className="col-auto">
              <MotionButton
                content="Ressourcen"
                name="ressource"
                icon={faLeaf}
                onClick={(e) => onHabitatCategory(e)}
                theme={habitatCategory === "ressource" ? activeKingdomName : ""}
              />
            </div>
            <div className="col-auto">
              <MotionButton
                content="Tiere"
                name="creature"
                icon={faPaw}
                onClick={(e) => onHabitatCategory(e)}
                theme={habitatCategory === "creatured" ? activeKingdomName : ""}
              />
            </div>
            <div className="col-auto">
              <MotionButton
                content="Humanoide"
                name="human"
                icon={faPersonWalking}
                onClick={(e) => onHabitatCategory(e)}
                theme={habitatCategory === "human" ? activeKingdomName : ""}
              />
            </div>
            <div className="col-auto">
              <MotionButton
                content="Zurück"
                name="back"
                icon={faReply}
                onClick={onBack}
              />
            </div>
          </div>
          <div className="container">
            <div className="row">
              {
                habitatCategory === 'ressource' ?
                (
                  <RessourceList />
                ) : habitatCategory === 'creature' ?
                (
                  <CreatureList  />
                ) : habitatCategory === 'human' ?
                (
                  <HumanoidList />
                ) : null
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitatDetails;

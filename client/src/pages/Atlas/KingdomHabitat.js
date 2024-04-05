import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getHabitat } from "../../features/habitats/habitatSlice";
import { motion } from "framer-motion";
import {
  faLeaf,
  faPaw,
  faPersonWalking,
} from "@fortawesome/free-solid-svg-icons";
import MotionButton from "../../components/MotionButton";


const HabitatInfo = ({ habitat, kingdom, setActiveHabitat }) => {
  const { name } = habitat;
  const dispatch = useDispatch();

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-4">
          <img
            alt=""
            className="img-habitat"
            src={`habitat/${kingdom}/${habitat._id}.png`}
          />
        </div>

        <div className="col-8 ">
          <h1>{name}</h1>

          <h2>Beschreibung</h2>
          <p>{habitat.description}</p>
          <div className="row">
            <div className="col-auto">
              <MotionButton
                content="Flora & Fauna"
                name="details"
                icon={faLeaf}
                onClick={(e) =>
                  setActiveHabitat(habitat)
                }
                /*                       theme={
                        activeKingdom.name === kingdom.name &&
                        activeKingdom.category === "map"
                          ? fractionTheme
                          : ""
                      } */
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitatInfo;

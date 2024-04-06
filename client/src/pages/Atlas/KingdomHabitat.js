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
import { setActiveHabitat } from "../../features/atlas/atlasSlice";


const HabitatInfo = ({ habitat, kingdom }) => {
  const { name } = habitat;
  const dispatch = useDispatch();
  const habitatActive = (e) => {
    const id = e.currentTarget.name
    console.log(id)
    dispatch(setActiveHabitat({id}))
  }

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
                name={habitat._id}
                icon={faLeaf}
                onClick={(e) =>
                  habitatActive(e)
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

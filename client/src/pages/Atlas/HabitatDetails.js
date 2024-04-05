import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getHabitat } from "../../features/habitats/habitatSlice";
import { motion } from "framer-motion";
import { faLeaf, faPaw, faPersonWalking, faReply } from "@fortawesome/free-solid-svg-icons";
import MotionButton from "../../components/MotionButton";


const HabitatDetails = ({ habitat, kingdom, categoryActive, back }) => {
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
          
          <div className="row">
            <div className="col-auto">
            <MotionButton
                      content="Ressourcen"
                      name="ressource"
                      icon={faLeaf}
                      onClick={(e)=>categoryActive({kingdom: kingdom, category: e.currentTarget.name, habitat: habitat})}
/*                       theme={
                        activeKingdom.name === kingdom.name &&
                        activeKingdom.category === "map"
                          ? fractionTheme
                          : ""
                      } */
                    />
            </div>
            <div className="col-auto">
            <MotionButton
                      content="Tiere"
                      name="animal"
                      icon={faPaw}
/*                       theme={
                        activeKingdom.name === kingdom.name &&
                        activeKingdom.category === "map"
                          ? fractionTheme
                          : ""
                      } */
                    />
            </div>
            <div className="col-auto">
            <MotionButton
                      content="Humanoide"
                      name="human"
                      icon={faPersonWalking}
/*                       theme={
                        activeKingdom.name === kingdom.name &&
                        activeKingdom.category === "map"
                          ? fractionTheme
                          : ""
                      } */
                    />
            </div>
            <div className="col-auto">
            <MotionButton
                      content="Zurück"
                      name="back"
                      icon={faReply}
/*                       theme={
                        activeKingdom.name === kingdom.name &&
                        activeKingdom.category === "map"
                          ? fractionTheme
                          : ""
                      } */
                      onClick={()=>back({})}
                    />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitatDetails;

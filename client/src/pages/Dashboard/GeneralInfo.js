import React from "react";
import { motion } from "framer-motion";
import { useSelector} from "react-redux";
function GeneralInfo() {
  const { name, general, profession, level, armor} = useSelector(
    (state) => state.player
  );
  return (
    <motion.div
      className="general-container"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {},
      }}
    >
      <h5>{name}</h5>
      <h5>{profession.name}</h5>
      <ul>
        <li>
          {general.kind},<strong>{general.age}</strong> Jahre alt
        </li>
        <li>
          Geboren in <strong>{general.origin}</strong>
        </li>
        <li>
          Erfahrungsstufe <strong>{level}</strong>
        </li>
        <li>
          Rüstwert <strong>{armor}</strong>
        </li>
      </ul>
    </motion.div>
  );
}

export default GeneralInfo;

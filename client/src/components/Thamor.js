import React from "react";
import { motion } from "framer-motion";
function Thamor({ bgAnimation, detailsLogo, mainLogo, lightsAnimation }) {
  return (
    <div className="flag">
      <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 590.9 756.82">
        <g isolation="isolate">
          <g id="_Layer" data-name="Layer">
            <motion.g
              id="bg"
              variants={bgAnimation}
              initial="init"
              animate="visible"
            >
            </motion.g>
            <motion.g
              id="details"
              variants={detailsLogo}
              initial="init"
              animate="visible"
            >

            </motion.g>
            <motion.g
              id="main"
              variants={mainLogo}
              initial="init"
              animate="visible"
            >

            </motion.g>

            <g id="roll">

            </g>
            <motion.g
              id="lights"
              variants={lightsAnimation}
              initial="init"
              animate="visible"
            >

            </motion.g>
          </g>
        </g>
      </motion.svg>
    </div>
  );
}

export default Thamor;

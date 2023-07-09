import React from "react";
import "../../Styles/Companions.css";
import { motion } from "framer-motion";
import { pageTransition } from "../../data/Animations";
function Companions(props) {
  return (
    <div className="dark-bg">
      <div className={`bg ${props?.originName}-bg  companions-page`}>
        <motion.div
            variants={pageTransition}
            initial="init"
            animate="animate"
            exit="exit"
        >
          <div className="container-fluid g-5">
            Hier siehst du deine Begleiter
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Companions;

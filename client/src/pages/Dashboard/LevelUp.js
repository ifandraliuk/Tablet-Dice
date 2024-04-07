import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
const LevelUp = ({ level, newLevel, fraction }) => {

  useEffect(()=>{

  })
  const variants = {
    active: {
      scale: [0.5, 1],
      borderRadius: "50%", 
      transition: {
        duration: 0.3,
        ease: [0, 0.71, 0.2, 1.01],
        repeat: Infinity,
        scale: {
          type: "spring",
          damping: 5,
          stiffness: 100,
          restDelta: 0.001,
        },
      },
    },
  };
  return (
    <motion.button
      className={`round-btn ${fraction}`}
      variants={variants}
      animate="active"
      onClick={newLevel}
    >
      {level}
      <strong className={`${fraction}-text`}>
        <FontAwesomeIcon icon={faPlus} />
      </strong>
    </motion.button>
  );
};

export default LevelUp;
